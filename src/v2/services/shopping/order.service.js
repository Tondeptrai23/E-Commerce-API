import Variant from "../../models/products/variant.model.js";
import ShippingAddress from "../../models/user/address.model.js";
import Order from "../../models/shopping/order.model.js";
import User from "../../models/user/user.model.js";
import Coupon from "../../models/shopping/coupon.model.js";
import { ResourceNotFoundError } from "../../utils/error.js";
import ProductImage from "../../models/products/productImage.model.js";
import PaginationBuilder from "../condition/paginationBuilder.service.js";
import OrderFilterBuilder from "../condition/filter/orderFilterBuilder.service.js";
import OrderSortBuilder from "../condition/sort/orderSortBuilder.service.js";
import FilterBuilder from "../condition/filter/filterBuilder.service.js";
import VariantFilterBuilder from "../condition/filter/variantFilterBuilder.service.js";

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
            include: getIncludeOptions(),
            paranoid: false,
        });

        if (!order) {
            throw new ResourceNotFoundError("Order not found");
        }
        return order;
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
            include: getIncludeOptions(),
        });
        if (!order) {
            throw new ResourceNotFoundError("Order not found");
        }

        return order;
    }

    /**
     * Get an order for admin
     */
    async getAdminOrder(orderID) {
        const order = await Order.findByPk(orderID, {
            include: getIncludeOptions(),
            paranoid: false,
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
    async getOrders(user, query) {
        const conditions = this.#buildConditions(query);

        const count = await user.countOrders({
            where: conditions.orderFilter,
        });

        const orders = await user.getOrders({
            include: [
                {
                    model: ShippingAddress,
                    as: "shippingAddress",
                    paranoid: false,
                    attributes: {
                        exclude: [
                            "createdAt",
                            "updatedAt",
                            "deletedAt",
                            "isDefault",
                        ],
                    },
                },
                {
                    model: Coupon,
                    as: "coupon",
                    attributes: ["code"],
                    where: conditions.couponFilter,
                },
            ],
            ...conditions.paginationConditions,
            where: conditions.orderFilter,
            order: conditions.sortingConditions,
        });

        return {
            currentPage:
                conditions.paginationConditions.offset /
                    conditions.paginationConditions.limit +
                1,
            totalPages: Math.ceil(
                count / conditions.paginationConditions.limit
            ),
            totalItems: count,
            orders: orders,
        };
    }

    /**
     * Get all orders for admin
     *
     * @param {Object} query - The query parameters
     * @returns {Promise<Order[]>} - The orders of the user.
     */
    async getAdminOrders(query) {
        const conditions = this.#buildConditions(query);

        const orderIDs = (
            await Order.findAll({
                attributes: ["orderID"],
                include: [
                    {
                        model: ShippingAddress,
                        as: "shippingAddress",
                        paranoid: false,
                        attributes: [],
                        where: [...conditions.shippingAddressFilter],
                    },
                    {
                        model: Coupon,
                        as: "coupon",
                        attributes: [],
                        where: [...conditions.couponFilter],
                    },
                    {
                        model: Variant,
                        as: "products",
                        paranoid: false,
                        required: conditions.variantFilter.length > 0,
                        through: {
                            attributes: [],
                        },
                        attributes: [],
                        where: [...conditions.variantFilter],
                    },
                ],
                where: conditions.orderFilter,
                paranoid: false,
            })
        ).map((order) => order.orderID);

        const count = await Order.count({
            where: {
                orderID: orderIDs,
            },
            paranoid: false,
        });

        const orders = await Order.findAll({
            include: [
                {
                    model: ShippingAddress,
                    as: "shippingAddress",
                    paranoid: false,
                    attributes: {
                        exclude: [
                            "createdAt",
                            "updatedAt",
                            "deletedAt",
                            "isDefault",
                        ],
                    },
                },
                {
                    model: Coupon,
                    as: "coupon",
                    attributes: ["code"],
                },
            ],
            where: {
                orderID: orderIDs,
            },

            ...conditions.paginationConditions,
            order: conditions.sortingConditions,
            paranoid: false,
        });

        return {
            currentPage:
                conditions.paginationConditions.offset /
                    conditions.paginationConditions.limit +
                1,
            totalPages: Math.ceil(
                count / conditions.paginationConditions.limit
            ),
            totalItems: count,
            orders: orders,
        };
    }

    /**
     * Build conditions for getting orders
     *
     * @param {Object} query - The query parameters
     * @returns {Object} - The conditions
     */
    #buildConditions(query) {
        const paginationConditions = new PaginationBuilder(query).build();

        if (!query || Object.keys(query).length === 0) {
            return {
                paginationConditions,
                orderFilter: [],
                couponFilter: [],
                variantFilter: [],
                shippingAddressFilter: [],
                sortingConditions: [],
            };
        }

        const orderFilter = new OrderFilterBuilder(query).build();
        const couponFilter = new FilterBuilder({
            code: query.couponCode,
        }).build();
        const variantFilter = new VariantFilterBuilder(query.variant).build();
        const sortingConditions = new OrderSortBuilder(query).build();

        const queryShippingAddress = query.shippingAddress
            ? {
                  recipientName: query.shippingAddress.recipientName,
                  phoneNumber: query.shippingAddress.phoneNumber,
                  address: query.shippingAddress.address,
                  city: query.shippingAddress.city,
                  district: query.shippingAddress.district,
              }
            : {};

        const shippingAddressFilter = new FilterBuilder(
            queryShippingAddress
        ).build();

        return {
            paginationConditions,
            orderFilter,
            couponFilter,
            variantFilter,
            shippingAddressFilter,
            sortingConditions,
        };
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
            message: undefined,
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

        if (orderData.message !== undefined) {
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

        if (order.status === "pending") {
            await order.destroy({
                force: true,
            });
        } else {
            await order.destroy();
        }
    }
}

const getIncludeOptions = () => {
    return [
        {
            model: Variant,
            as: "products",
            paranoid: false,
            attributes: [
                "name",
                "price",
                "discountPrice",
                "productID",
                "variantID",
            ],
            include: {
                model: ProductImage,
                as: "image",
                attributes: ["url"],
            },
        },
        {
            model: ShippingAddress,
            as: "shippingAddress",
            paranoid: false,
            attributes: {
                exclude: ["createdAt", "updatedAt", "deletedAt", "isDefault"],
            },
        },
        {
            model: Coupon,
            as: "coupon",
            attributes: ["code"],
        },
    ];
};

export default new OrderService();
