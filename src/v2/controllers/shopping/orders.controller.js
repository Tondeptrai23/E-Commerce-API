import { StatusCodes } from "http-status-codes";

import orderService from "../../services/shopping/order.service.js";
import couponService from "../../services/shopping/coupon.service.js";
import OrderSerializer from "../../services/serializers/order.serializer.service.js";
import PaymentFactory from "../../services/payment/paymentFactory.service.js";

class OrderController {
    async getPendingOrder(req, res, next) {
        try {
            // Call service
            const order = await orderService.getPendingOrder(req.user);

            // Serialize data
            const serializedOrder = OrderSerializer.parse(order, {
                includeTimestamps: true,
                includeAddress: true,
            });

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                order: serializedOrder,
            });
        } catch (err) {
            next(err);
        }
    }

    async getOrders(req, res, next) {
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
            next(err);
        }
    }

    async getOrder(req, res, next) {
        try {
            // Get param
            const { orderID } = req.params;

            // Call service
            const order = await orderService.getOrder(req.user, orderID);

            // Serialize data
            const serializedOrder = OrderSerializer.parse(order, {
                includeTimestamps: true,
                includeAddress: true,
            });

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                order: serializedOrder,
            });
        } catch (err) {
            next(err);
        }
    }

    async getOrdersAdmin(req, res, next) {
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
            next(err);
        }
    }

    async getOrderAdmin(req, res, next) {
        try {
            // Get param
            const { orderID } = req.params;

            // Call service
            const order = await orderService.getAdminOrder(orderID);

            // Serialize data
            const serializedOrder = OrderSerializer.parse(order, {
                isAdmin: true,
                includeAddress: true,
            });

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                order: serializedOrder,
            });
        } catch (err) {
            next(err);
        }
    }

    async postOrder(req, res, next) {
        try {
            // POST /api/v2/orders/pending
            // Get param
            const { payment } = req.body;

            const order = await orderService.checkOutOrder(req.user, payment);
            // Serialize data
            const serializedOrder = OrderSerializer.parse(order, {
                includeAddress: true,
            });
            // If payment is COD, checkout order immediately
            if (payment === "COD") {
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
                order: serializedOrder,
                paymentUrl: paymentInfo.paymentUrl,
            });
        } catch (err) {
            next(err);
        }
    }

    async updateOrder(req, res, next) {
        try {
            // Get param
            const { message, addressID, address } = req.body;

            // Call service
            let order = await orderService.getPendingOrder(req.user);
            order = await orderService.updateOrder(order, {
                message: message,
                addressID: addressID,
                address: address,
            });

            // Serialize data
            const serializedOrder = OrderSerializer.parse(order, {
                includeAddress: true,
            });

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                order: serializedOrder,
            });
        } catch (err) {
            next(err);
        }
    }

    async applyCoupon(req, res, next) {
        try {
            // Get params
            const { code } = req.body;

            // Call service
            let order = await orderService.getPendingOrder(req.user);
            order = await couponService.applyCoupon(order, code);

            // Serailize data
            const serializedOrder = OrderSerializer.parse(order, {
                includeAddress: true,
            });

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                order: serializedOrder,
            });
        } catch (err) {
            next(err);
        }
    }

    async getRecommendedCoupons(req, res, next) {
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
            next(err);
        }
    }

    async deleteOrder(req, res, next) {
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
            next(err);
        }
    }
}
export default new OrderController();
