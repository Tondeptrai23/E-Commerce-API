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
import { db } from "../../models/index.model.js";
import PaginationBuilder from "../condition/paginationBuilder.service.js";
import couponService from "./coupon.service.js";

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
    async #findCartItem(user, variantID) {
        const cartItem = await CartItem.findOne({
            where: {
                userID: user.userID,
                variantID: variantID,
            },
        });

        return cartItem;
    }
    /**
     * Get detailed cart item
     *
     * @param {User} user - The user object.
     * @param {String} variantID - The variant ID.
     * @returns {Promise<Variant>} The cart item.
     * @throws {ResourceNotFoundError} If the cart item is not found.
     */
    async getDetailedCartItem(user, variantID) {
        const cartItems = await user.getCartItems({
            where: {
                variantID: variantID,
            },
            attributes: [
                "variantID",
                "productID",
                "name",
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
        });

        if (cartItems.length === 0) {
            throw new ResourceNotFoundError("Cart item not found");
        }

        return cartItems[0];
    }

    /**
     * Retrieves the user's cart items.
     * @param {User} user - The user object.
     * @param {Object} query - The query parameters.
     * @returns {Promise<CartItem[]>} The cart items.
     */
    async getCart(user, query) {
        const paginationConditions = new PaginationBuilder(query).build();

        const cart = await user.getCartItems({
            attributes: [
                "variantID",
                "productID",
                "name",
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
            ...paginationConditions,
        });

        const count = await CartItem.count({
            where: {
                userID: user.userID,
            },
        });

        return {
            currentPage:
                paginationConditions.offset / paginationConditions.limit + 1,
            totalPages: Math.ceil(count / paginationConditions.limit),
            totalItems: count,
            cart: cart,
        };
    }

    /**
     * Fetches the user's cart items and prepares them for ordering.
     * Create an pending order, add the cart items to the order, and calculate the total amount.
     *
     * If an existing pending order is found, the order will be updated with the new items.
     *
     * If a coupon is applied, the final total will be recalculated.
     *
     * The cart items will be removed after the order is checked out.
     *
     * @param {User} user - The user object
     * @param {String[]} variantIDs - The variant IDs
     * @returns {Promise<Order[]>} The order.
     * @throws {ResourceNotFoundError} If the cart items are not found.
     */
    async fetchCartToOrder(user, variantIDs) {
        return await db
            .transaction(async (t) => {
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

                // Find existing pending order
                const existingOrder = await Order.findOne({
                    where: {
                        userID: user.userID,
                        status: "pending",
                    },
                });

                // Find default shipping address
                const shippingAddress = await ShippingAddress.findOne({
                    where: {
                        userID: user.userID,
                    },
                });
                const addressID = shippingAddress
                    ? shippingAddress.addressID
                    : null;

                // Create or update order
                let newOrder;
                if (existingOrder) {
                    await OrderItem.destroy({
                        where: {
                            orderID: existingOrder.orderID,
                        },
                    });

                    newOrder = existingOrder.set({
                        shippingAddressID: addressID,
                        message: null,
                        createdAt: new Date(),
                        finalTotal: 0,
                        subTotal: 0,
                    });
                } else {
                    newOrder = await Order.create({
                        userID: user.userID,
                        shippingAddressID: addressID,
                        status: "pending",
                    });
                }

                // Calculate total amount and create order items
                let totalAmount = 0;
                const orderItems = cart.map((variant) => {
                    totalAmount += variant.discountPrice
                        ? variant.discountPrice * variant.cartItem.quantity
                        : variant.price * variant.cartItem.quantity;

                    return {
                        orderID: newOrder.orderID,
                        variantID: variant.variantID,
                        quantity: variant.cartItem.quantity,
                        priceAtPurchase: variant.price,
                        discountPriceAtPurchase: variant.discountPrice,
                    };
                });
                await OrderItem.bulkCreate(orderItems);
                newOrder.set({
                    subTotal: totalAmount,
                    finalTotal: totalAmount,
                });

                // Apply coupon if available
                if (newOrder.couponID) {
                    const coupon = await Coupon.findByPk(newOrder.couponID);

                    const newFinalTotal = await couponService.calcFinalTotal(
                        {
                            ...newOrder.toJSON(),
                            orderItems: orderItems,
                        },
                        coupon
                    );

                    newOrder.set({
                        finalTotal: newFinalTotal,
                    });
                }

                await newOrder.save();

                return await Order.findByPk(newOrder.orderID, {
                    include: [
                        {
                            model: Variant,
                            as: "products",
                            attributes: ["productID", "variantID", "name"],
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
            })
            .catch((err) => {
                throw err;
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
        let variant = await Variant.findByPk(variantID);

        if (!variant) {
            throw new ResourceNotFoundError("Variant not found");
        }

        let cartItem = await this.#findCartItem(user, variantID);

        if (cartItem) {
            cartItem = await cartItem.update({
                quantity: cartItem.quantity + quantity,
            });
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
        let cartItem = await this.#findCartItem(user, variantID);

        if (!cartItem) {
            throw new ResourceNotFoundError("Cart item not found");
        }

        cartItem = await cartItem.update({
            quantity: quantity,
        });

        return cartItem;
    }

    /**
     * Deletes a variant from the user's cart.
     * @param {User} user - The user object.
     * @param {String} variantID - The variant ID.
     * @throws {ResourceNotFoundError} If the cart item is not found.
     */
    async deleteItem(user, variantID) {
        let cartItem = await this.#findCartItem(user, variantID);

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
