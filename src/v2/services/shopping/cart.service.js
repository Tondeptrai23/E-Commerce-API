import CartItem from "../../models/userOrder/cartItem.model.js";
import User from "../../models/userOrder/user.model.js";
import Variant from "../../models/products/variant.model.js";
import Order from "../../models/userOrder/order.model.js";
import { ResourceNotFoundError } from "../../utils/error.js";
import ShippingAddress from "../../models/userOrder/address.model.js";
import OrderItem from "../../models/userOrder/orderItem.model.js";

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
        const cart = await user.getCartItems();

        return cart;
    }

    /**
     * Fetches the user's cart items and prepares them for ordering.
     * The cart items are removed from the cart and added to a new order.
     *
     * @param {User} user - The user object
     * @param {String} addressID - The shipping address ID
     * @returns {Promise<Order[]>} The order.
     * @throws {ResourceNotFoundError} If the cart is empty.
     */
    async fetchCartToOrder(user, addressID) {
        const cart = await this.getCart(user);

        if (cart.length === 0) {
            throw new ResourceNotFoundError("Cart is empty");
        }

        const address = await ShippingAddress.findByPk(addressID);
        if (!address) {
            throw new ResourceNotFoundError("Address not found");
        }

        let newOrder = await Order.create({
            userID: user.userID,
            orderDate: new Date(),
            status: "pending",
            shippingAddressID: addressID,
            totalAmount: 0,
        });

        let totalAmount = 0;
        const orderItems = await Promise.all(
            cart.map(async (variant) => {
                totalAmount += variant.price * variant.cartItem.quantity;

                const data = {
                    orderID: newOrder.orderID,
                    variantID: variant.variantID,
                    quantity: variant.cartItem.quantity,
                };
                variant.cartItem.destroy();

                return await OrderItem.create(data);
            })
        );

        newOrder.totalAmount = totalAmount;
        newOrder = await newOrder.save();
        newOrder.dataValues.orderItems = orderItems;

        return newOrder;
    }

    /**
     * Adds a variant to the user's cart.
     * If the variant already exists in the cart, the quantity is incremented.
     * @param {User} user - The user object.
     * @param {String} variantID - The variant ID.
     * @returns {Promise<CartItem>} The updated cart item.
     */
    async addToCart(user, variantID) {
        let cartItem = await this.findCartItem(user, variantID);

        if (cartItem) {
            cartItem.quantity += 1;
            cartItem = await cartItem.save();
        } else {
            cartItem = await CartItem.create({
                userID: user.userID,
                variantID: variantID,
                quantity: 1,
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
