import { StatusCodes } from "http-status-codes";

import orderService from "../../services/shopping/order.service.js";
import cartService from "../../services/shopping/cart.service.js";
import { ResourceNotFoundError } from "../../utils/error.js";

class OrderController {
    async getOrders(req, res) {
        try {
            // Call service
            const orders = await orderService.getOrders(req.user);

            // Serialize data

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                orders: orders,
            });
        } catch (err) {
            console.log(err);

            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: "Server error in getting orders",
            });
        }
    }

    async getOrder(req, res) {
        try {
            // Get param
            const { orderID } = req.params;

            // Call service
            let order = await orderService.getOrder(req.user, orderID);

            // Serialize data

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                order: order,
            });
        } catch (err) {
            console.log(err);

            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    error: err.message,
                });
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    error: "Server error in getting order",
                });
            }
        }
    }

    async postOrder(req, res) {
        try {
            //
        } catch (err) {
            console.log(err);

            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: "Server error in checking out order",
            });
        }
    }

    async updateOrder(req, res) {
        try {
            // Get param
            const { orderID } = req.params;
            const { status, orderDate, shippingAddress } = req.body;

            // Call service
            let order = await orderService.updateOrder(user, orderID, {
                status: status,
                orderDate: orderDate,
                shippingAddress: shippingAddress,
            });

            // Serialize data

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                order: order,
            });
        } catch (err) {
            console.log(err);

            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    error: err.message,
                });
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    error: "Server error in updating order",
                });
            }
        }
    }

    async moveToCart(req, res) {
        try {
            // Get params
            const { orderID } = req.params;

            // Call service
            await orderService.moveToCart(req.user, orderID);
            const cart = await cartService.getCart(req.user);

            // Serialize data

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                cart: cart,
            });
        } catch (err) {
            console.log(err);

            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    error: err.message,
                });
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    error: "Server error in moving order to cart",
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
            console.log(err);

            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    error: err.message,
                });
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    error: "Server error in deleting order",
                });
            }
        }
    }

    async deleteAllOrders(req, res) {
        try {
            // Call service
            await orderService.deleteAllOrders(req.user);

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
            });
        } catch (err) {
            console.log(err);

            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: "Server error in deleting all orders",
            });
        }
    }
}
export default new OrderController();
