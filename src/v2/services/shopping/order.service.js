import Variant from "../../models/products/variant.model.js";
import ShippingAddress from "../../models/userOrder/address.model.js";
import Order from "../../models/userOrder/order.model.js";
import User from "../../models/userOrder/user.model.js";
import { ResourceNotFoundError } from "../../utils/error.js";

class OrderService {
    /**
     * Get pending order
     *
     * @param {User} user - The user
     * @returns {Promise<Order>} - The pending order
     * @throws {ResourceNotFoundError} - If the order is not found
     */
    async getPendingOrder(user) {
        const order = await Order.findOne({
            where: {
                userID: user.userID,
                status: "pending",
            },
            include: {
                model: Variant,
                as: "products",
            },
        });

        if (!order) {
            throw new ResourceNotFoundError("Order not found");
        }
        return order;
    }

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
        const order = await Order.findOne({
            where: {
                userID: user.userID,
                orderID: orderID,
            },
            include: {
                model: Variant,
                as: "products",
            },
        });
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
     * @param {Order} order - The ID of the order.
     * @param {Object} orderData - The updated order data.
     * @returns {Promise<Order>} - The updated order.
     * @throws {ResourceNotFoundError} - If the order is not found.
     */
    async updateOrder(
        order,
        orderData = {
            message: null,
            addressID: null,
        }
    ) {
        let shippingAddress = null;
        if (orderData.addressID) {
            shippingAddress = await ShippingAddress.findOne({
                where: {
                    userID: order.userID,
                    addressID: orderData.addressID,
                },
            });
            if (!shippingAddress) {
                throw new ResourceNotFoundError("Address not found");
            }
            order.shippingAddressID = shippingAddress.addressID;
            order.dataValues.shippingAddress = shippingAddress;
        }

        if (orderData.message) {
            const message = orderData.message
                ? orderData.message
                : order.message;
            order.message = message;
        }

        return await order.save();
    }

    /**
     * Delete an order.
     *
     * @param {User} user - The user.
     * @param {String} orderID - The ID of the order.
     * @throws {ResourceNotFoundError} - If the order is not found.
     */
    async deleteOrder(user, orderID) {
        const order = await Order.findOne({
            where: {
                userID: user.userID,
                orderID: orderID,
            },
        });
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
