import CartItem from "../../models/shopping/cartItem.model.js";
import User from "../../models/user/user.model.js";
import Variant from "../../models/products/variant.model.js";
import Order from "../../models/shopping/order.model.js";
import { ResourceNotFoundError } from "../../utils/error.js";
import ShippingAddress from "../../models/user/address.model.js";
import OrderItem from "../../models/shopping/orderItem.model.js";
import { Op } from "sequelize";
import ProductImage from "../../models/products/productImage.model.js";
import Coupon from "../../models/shopping/coupon.model.js";
import Product from "../../models/products/product.model.js";

/**
 * Service class for managing the user's shopping cart.
 */
class CartService {
    /**
     * Finds a cart item for the given user and variant ID.
     * @private
     * @param {User} user - The user object.
     * @param {String} variantID - The variant ID.
     * @returns {Promise<CartItem | null>} The cart item.
     */
    async findCartItem(user, variantID) {
        const cartItem = await CartItem.findOne({
            where: {
                userID: user.userID,
                variantID: variantID,
            },
        });

        return cartItem;
    }

    /**
     * Retrieves the user's cart items.
     * @param {User} user - The user object.
     * @returns {Promise<CartItem[]>} The cart items.
     */
    async getCart(user) {
        const cart = (
            await User.findByPk(user.userID, {
                attributes: [],
                where: {
                    userID: user.userID,
                },
                include: [
                    {
                        model: Variant,
                        as: "cartItems",
                        attributes: [
                            "productID",
                            "variantID",
                            "price",
                            "discountPrice",
                        ],
                        include: [
                            {
                                model: ProductImage,
                                as: "image",
                                attributes: ["url"],
                            },
                        ],
                    },
                ],
            })
        ).cartItems;

        return cart;
    }

    /**
     * Fetches the user's cart items and prepares them for ordering.
     * Create an pending order
     * CartItem will be removed after order is checked out
     *
     * @param {User} user - The user object
     * @param {String[]} variantIDs - The variant IDs
     * @returns {Promise<Order[]>} The order.
     * @throws {ResourceNotFoundError} If the cart items are not found.
     */
    async fetchCartToOrder(user, variantIDs) {
        // Check for valid data
        const cart = await user.getCartItems({
            where: {
                variantID: {
                    [Op.in]: variantIDs,
                },
            },
        });

        if (cart.length === 0) {
            throw new ResourceNotFoundError("No cart items found");
        }

        // Remove existing pending order
        const pendingOrder = await Order.findOne({
            where: {
                userID: user.userID,
                status: "pending",
            },
        });
        if (pendingOrder) {
            await pendingOrder.destroy();
        }

        // Find default shipping address
        const shippingAddress = await ShippingAddress.findOne({
            where: {
                userID: user.userID,
            },
        });

        let newOrder = await Order.create({
            userID: user.userID,
            orderDate: new Date(),
            status: "pending",
            shippingAddressID: shippingAddress.addressID,
            totalAmount: 0,
        });

        // Calculate total amount
        let totalAmount = 0;
        const orderItems = cart.map((variant) => {
            totalAmount += variant.price * variant.cartItem.quantity;

            return {
                orderID: newOrder.orderID,
                variantID: variant.variantID,
                quantity: variant.cartItem.quantity,
            };
        });

        await OrderItem.bulkCreate(orderItems);

        await newOrder.update({
            subTotal: totalAmount,
            finalTotal: totalAmount,
        });

        return await Order.findByPk(newOrder.orderID, {
            include: [
                {
                    model: Variant,
                    as: "products",
                    include: {
                        model: ProductImage,
                        as: "image",
                        attributes: ["url"],
                    },
                },
                {
                    model: ShippingAddress,
                    as: "shippingAddress",
                },
                {
                    model: Coupon,
                    as: "coupon",
                    attributes: ["code"],
                },
            ],
        });
    }

    /**
     * Adds a variant to the user's cart.
     * If the variant already exists in the cart, the quantity is incremented.
     * @param {User} user - The user object.
     * @param {String} variantID - The variant ID.
     * @returns {Promise<CartItem>} The updated cart item.
     * @throws {ResourceNotFoundError} If the variant is not found.
     */
    async addToCart(user, variantID, quantity) {
        const variant = await Variant.findByPk(variantID);
        if (!variant) {
            throw new ResourceNotFoundError("Variant not found");
        }

        let cartItem = await this.findCartItem(user, variantID);

        if (cartItem) {
            cartItem.quantity += quantity;
            cartItem = await cartItem.save();
        } else {
            cartItem = await CartItem.create({
                userID: user.userID,
                variantID: variantID,
                quantity: quantity,
            });
        }

        return cartItem;
    }

    /**
     * Updates the quantity of a variant in the user's cart.
     * @param {User} user - The user object.
     * @param {String} variantID - The variant ID.
     * @param {Number} quantity - The new quantity.
     * @returns {Promise<CartItem>} The updated cart item.
     * @throws {ResourceNotFoundError} If the cart item is not found.
     */
    async updateCart(user, variantID, quantity) {
        let cartItem = await this.findCartItem(user, variantID);

        if (!cartItem) {
            throw new ResourceNotFoundError("Cart item not found");
        }

        cartItem.quantity = quantity;
        return await cartItem.save();
    }

    /**
     * Deletes a variant from the user's cart.
     * @param {User} user - The user object.
     * @param {String} variantID - The variant ID.
     * @throws {ResourceNotFoundError} If the cart item is not found.
     */
    async deleteItem(user, variantID) {
        let cartItem = await this.findCartItem(user, variantID);

        if (!cartItem) {
            throw new ResourceNotFoundError("Cart item not found");
        }

        await cartItem.destroy();
    }

    /**
     * Deletes all cart items for the given user.
     * @param {User} user - The user object.
     */
    async deleteCart(user) {
        await CartItem.destroy({
            where: {
                userID: user.userID,
            },
        });
    }
}

export default new CartService();
