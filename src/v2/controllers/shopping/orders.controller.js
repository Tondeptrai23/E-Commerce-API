import { StatusCodes } from "http-status-codes";

import orderService from "../../services/shopping/order.service.js";
import {
    ConflictError,
    ResourceNotFoundError,
    PaymentInvalidError,
} from "../../utils/error.js";
import couponService from "../../services/shopping/coupon.service.js";
import OrderSerializer from "../../services/serializers/order.serializer.service.js";
import PaymentFactory from "../../services/payment/paymentFactory.service.js";

class OrderController {
    async getPendingOrder(req, res) {
        try {
            // Call service
            const order = await orderService.getPendingOrder(req.user);

            // Serialize data
            const serializedOrder = OrderSerializer.parse(order, {
                includeTimestamps: true,
                detailAddress: true,
            });

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                order: serializedOrder,
            });
        } catch (err) {
            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    errors: [
                        {
                            error: "NotFound",
                            message: err.message,
                        },
                    ],
                });
            } else {
                console.log(err);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    errors: [
                        {
                            error: "ServerError",
                            message: "Server error in getting pending order",
                        },
                    ],
                });
            }
        }
    }

    async getOrders(req, res) {
        try {
            // Call service
            const { orders, currentPage, totalPages, totalItems } =
                await orderService.getOrders(req.user, req.query);

            // Serialize data
            const serializedOrders = OrderSerializer.parse(orders, {
                includeTimestamps: true,
            });

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                currentPage: currentPage,
                totalPages: totalPages,
                totalItems: totalItems,
                orders: serializedOrders,
            });
        } catch (err) {
            console.log(err);

            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                errors: [
                    {
                        error: "ServerError",
                        message: "Server error in getting orders",
                    },
                ],
            });
        }
    }

    async getOrder(req, res) {
        try {
            // Get param
            const { orderID } = req.params;

            // Call service
            const order = await orderService.getOrder(req.user, orderID);

            // Serialize data
            const serializedOrder = OrderSerializer.parse(order, {
                includeTimestamps: true,
                detailAddress: true,
            });

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                order: serializedOrder,
            });
        } catch (err) {
            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    errors: [
                        {
                            error: "NotFound",
                            message: err.message,
                        },
                    ],
                });
            } else {
                console.log(err);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    errors: [
                        {
                            error: "ServerError",
                            message: "Server error in getting order",
                        },
                    ],
                });
            }
        }
    }

    async getOrdersAdmin(req, res) {
        try {
            // Call service
            const { orders, currentPage, totalItems, totalPages } =
                await orderService.getAdminOrders(req.query);

            // Serialize data
            const serializedOrders = OrderSerializer.parse(orders, {
                isAdmin: true,
            });

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                currentPage: currentPage,
                totalItems: totalItems,
                totalPages: totalPages,
                orders: serializedOrders,
            });
        } catch (err) {
            console.log(err);

            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                errors: [
                    {
                        error: "ServerError",
                        message: "Server error in getting orders",
                    },
                ],
            });
        }
    }

    async getOrderAdmin(req, res) {
        try {
            // Get param
            const { orderID } = req.params;

            // Call service
            const order = await orderService.getAdminOrder(orderID);

            // Serialize data
            const serializedOrder = OrderSerializer.parse(order, {
                isAdmin: true,
                detailAddress: true,
            });

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                order: serializedOrder,
            });
        } catch (err) {
            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    errors: [
                        {
                            error: "NotFound",
                            message: err.message,
                        },
                    ],
                });
            } else {
                console.log(err);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    errors: [
                        {
                            error: "ServerError",
                            message: "Server error in getting order",
                        },
                    ],
                });
            }
        }
    }

    async postOrder(req, res) {
        try {
            // POST /api/v2/orders/pending/checkout
            // Get param
            const { payment } = req.body;

            const order = await orderService.checkOutOrder(req.user, payment);
            // If payment is COD, checkout order immediately
            if (payment === "COD") {
                // Serialize data
                const serializedOrder = OrderSerializer.parse(order, {
                    detailAddress: true,
                });

                // Response
                return res.status(StatusCodes.OK).json({
                    success: true,
                    order: serializedOrder,
                });
            }

            // Create payment
            let paymentInfo;
            try {
                const paymentService = PaymentFactory.createPayment(
                    payment,
                    order
                );
                paymentInfo = await paymentService.createPaymentUrl();
            } catch (err) {
                await orderService.handleFailedPayment(order.orderID);

                throw err;
            }

            // Call payment service
            res.status(StatusCodes.OK).json({
                success: true,
                order: order,
                paymentUrl: paymentInfo.paymentUrl,
            });
        } catch (err) {
            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    errors: [
                        {
                            error: "NotFound",
                            message: err.message,
                        },
                    ],
                });
            } else if (err instanceof ConflictError) {
                res.status(StatusCodes.CONFLICT).json({
                    success: false,
                    errors: [
                        {
                            error: "Conflict",
                            message: err.message,
                        },
                    ],
                });
            } else if (err instanceof PaymentInvalidError) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    errors: [
                        {
                            error: "PaymentInvalid",
                            message: err.message,
                        },
                    ],
                });
            } else {
                console.log(err);

                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    errors: [
                        {
                            error: "ServerError",
                            message: "Server error in posting order",
                        },
                    ],
                });
            }
        }
    }

    async updateOrder(req, res) {
        try {
            // Get param
            const { message, addressID } = req.body;

            // Call service
            let order = await orderService.getPendingOrder(req.user);
            order = await orderService.updateOrder(order, {
                message: message,
                addressID: addressID,
            });

            // Serialize data
            const serializedOrder = OrderSerializer.parse(order, {
                detailAddress: true,
            });

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                order: serializedOrder,
            });
        } catch (err) {
            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    errors: [
                        {
                            error: "NotFound",
                            message: err.message,
                        },
                    ],
                });
            } else {
                console.log(err);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    errors: [
                        {
                            error: "ServerError",
                            message: "Server error in updating order",
                        },
                    ],
                });
            }
        }
    }

    async applyCoupon(req, res) {
        try {
            // Get params
            const { code } = req.body;

            // Call service
            let order = await orderService.getPendingOrder(req.user);
            order = await couponService.applyCoupon(order, code);

            // Serailize data
            const serializedOrder = OrderSerializer.parse(order, {
                detailAddress: true,
            });

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                order: serializedOrder,
            });
        } catch (err) {
            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    errors: [
                        {
                            error: "NotFound",
                            message: err.message,
                        },
                    ],
                });
            } else {
                console.log(err);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    errors: [
                        {
                            error: "ServerError",
                            message: "Server error in applying coupon",
                        },
                    ],
                });
            }
        }
    }

    async getRecommendedCoupons(req, res) {
        try {
            // Call service
            const order = await orderService.getPendingOrder(req.user);
            const coupons = await couponService.getRecommendedCoupons(order);

            // Serialize data
            coupons.forEach((coupon) => {
                coupon.code = coupon.coupon.code;
                coupon.coupon = undefined;
            });

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                coupons: coupons,
            });
        } catch (err) {
            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    errors: [
                        {
                            error: "NotFound",
                            message: err.message,
                        },
                    ],
                });
            } else {
                console.log(err);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    errors: [
                        {
                            error: "ServerError",
                            message:
                                "Server error in getting recommended coupons",
                        },
                    ],
                });
            }
        }
    }

    async deleteOrder(req, res) {
        try {
            // Get param
            const { orderID } = req.params;

            // Call service
            await orderService.deleteOrder(req.user, orderID);

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
            });
        } catch (err) {
            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    errors: [
                        {
                            error: "NotFound",
                            message: err.message,
                        },
                    ],
                });
            } else {
                console.log(err);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    errors: [
                        {
                            error: "ServerError",
                            message: "Server error in deleting order",
                        },
                    ],
                });
            }
        }
    }
}
export default new OrderController();
