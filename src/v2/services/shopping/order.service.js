import Variant from "../../models/products/variant.model.js";
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
        const order = await user.getOrders({
            where: {
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

        return order[0];
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
        const order = await user.getOrders({
            where: {
                orderID: orderID,
            },
        });
        if (!order) {
            throw new ResourceNotFoundError("Order not found");
        }

        const updatedOrder = await order[0].update(orderData);

        return updatedOrder;
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

    /**
     * Update shipping address for pending order
     *
     * @param {User} user the user
     * @param {String} addressID the id of the address to be updated
     * @returns {Promise<Order>} the order after updating
     */
    async updateAddress(user, addressID) {
        const address = await user.getAddresses({
            where: {
                addressID: addressID,
            },
        });
        if (!address) {
            throw new ResourceNotFoundError("Address not found");
        }

        const order = await this.getPendingOrder(user);
        order.dataValues.shippingAddress = address[0].dataValues;

        order.update({
            shippingAddressID: address[0].addressID,
        });
        return order;
    }
}

export default new OrderService();
