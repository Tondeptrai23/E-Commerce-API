import Variant from "../../models/products/variant.model.js";
import ShippingAddress from "../../models/user/address.model.js";
import Order from "../../models/shopping/order.model.js";
import User from "../../models/user/user.model.js";
import Coupon from "../../models/shopping/coupon.model.js";
import { ResourceNotFoundError } from "../../utils/error.js";
import ProductImage from "../../models/products/productImage.model.js";

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
        if (orderData.addressID) {
            const shippingAddress = await ShippingAddress.findOne({
                where: {
                    userID: order.userID,
                    addressID: orderData.addressID,
                },
            });
            if (!shippingAddress) {
                throw new ResourceNotFoundError("Address not found");
            }
            order.shippingAddressID = shippingAddress.addressID;
            order.shippingAddress = shippingAddress;
        }

        if (orderData.message) {
            const message = orderData.message;
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
