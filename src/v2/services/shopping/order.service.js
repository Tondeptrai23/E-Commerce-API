import { Variant } from "../../models/products/variant.model.js";
import { Order } from "../../models/userOrder/order.model.js";
import { OrderItem } from "../../models/userOrder/orderItem.model.js";
import { CartItem } from "../../models/userOrder/cartItem.model.js";
import { User } from "../../models/userOrder/user.model.js";
import { ResourceNotFoundError } from "../../utils/error.js";
import cartService from "./cart.service.js";

class OrderService {
    /**
     * Get all orders for a user.
     *
     * @param {User} user - The user.
     * @returns {Promise<Order[]>} - The orders of the user.
     */
    async getOrders(user) {
        const orders = await user.getOrders({
            include: {
                model: Variant,
                as: "products",
            },
        });

        return orders;
    }

    /**
     * Get a specific order for a user.
     *
     * @param {User} user - The user.
     * @param {String} orderID - The ID of the order.
     * @returns {Promise<Order>} - The order.
     * @throws {ResourceNotFoundError} - If the order is not found.
     */
    async getOrder(user, orderID) {
        const order = (
            await user.getOrders({
                where: {
                    orderID: orderID,
                },
                include: {
                    model: Variant,
                    as: "products",
                },
            })
        )[0];

        if (!order) {
            throw new ResourceNotFoundError("Order not found");
        }

        return order;
    }

    /**
     * Checkout order
     *
     */
    async postOrder(user, orderItems) {
        //
    }

    /**
     * Update an order.
     *
     * @param {User} user - The user.
     * @param {String} orderID - The ID of the order.
     * @param {Object} orderData - The updated order data.
     * @returns {Promise<Order>} - The updated order.
     * @throws {ResourceNotFoundError} - If the order is not found.
     */
    async updateOrder(user, orderID, orderData) {
        const order = (
            await user.getOrders({
                where: {
                    orderID: orderID,
                },
            })
        )[0];

        if (!order) {
            throw new ResourceNotFoundError("Order not found");
        }

        await order;
        const updatedOrder = await order.update(orderData);

        return updatedOrder;
    }

    /**
     * Move an order to cart.
     *
     * @param {User} user - The user.
     * @param {String} orderID - The ID of the order.
     * @returns {Promise<CartItem[]>} - The cart items created from the order items.
     * @throws {ResourceNotFoundError} - If the order is not found.
     */
    async moveToCart(user, orderID) {
        const order = await Order.findOne({
            where: {
                orderID: orderID,
                userID: user.userID,
            },
        });

        if (!order) {
            throw new ResourceNotFoundError("Order not found");
        }

        const orderItems = await OrderItem.findAll({
            where: {
                orderID: orderID,
            },
        });

        const cart = await Promise.all(
            orderItems.map(async (orderItem) => {
                const cartItemData = {
                    userID: user.userID,
                    variantID: orderItem.variantID,
                    quantity: orderItem.quantity,
                };
                orderItem.destroy();

                const cartItem = await cartService.findCartItem(
                    user,
                    cartItemData.variantID
                );

                if (cartItem) {
                    cartItem.quantity += cartItemData.quantity;
                    return await cartItem.save();
                }

                return await CartItem.create(cartItemData);
            })
        );

        order.destroy();

        return cart;
    }

    /**
     * Delete an order.
     *
     * @param {User} user - The user.
     * @param {String} orderID - The ID of the order.
     * @throws {ResourceNotFoundError} - If the order is not found.
     */
    async deleteOrder(user, orderID) {
        const order = (
            await user.getOrders({
                where: {
                    orderID: orderID,
                },
            })
        )[0];

        if (!order) {
            throw new ResourceNotFoundError("Order not found");
        }

        await order.destroy();
    }

    /**
     * Delete all orders for a user.
     *
     * @param {User} user - The user.
     */
    async deleteAllOrders(user) {
        await Order.destroy({
            where: {
                userID: user.userID,
            },
        });
    }
}

export default new OrderService();
