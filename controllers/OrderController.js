import {
    OrderAPIResponseSerializer,
    ProductAPIResponseSerializer,
} from "../utils/apiResponseSerializer.js";
import { OrderService } from "../services/orderService.js";
import { StatusCodes } from "http-status-codes";
import { ResourceNotFoundError } from "../utils/error.js";

class OrderController {
    static getOrders = async (req, res) => {
        try {
            const orders = await OrderService.getOrders(req.user);

            if (orders === null || orders.length === 0) {
                res.status(StatusCodes.NO_CONTENT).json({});
                return;
            }

            // Format Data
            for (let order of orders) {
                order = OrderAPIResponseSerializer.serialize(order);
            }

            res.status(StatusCodes.OK).json({
                success: true,
                order: orders,
            });
        } catch (err) {
            console.log(err);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: "Error in getting orders.",
            });
        }
    };

    static getOrder = async (req, res) => {
        try {
            const order = await OrderService.getOrder(
                req.user.id,
                req.params.orderId
            );

            if (order === null) {
                throw new ResourceNotFoundError("Order not found.");
            }

            res.status(StatusCodes.OK).json({
                success: true,
                order: OrderAPIResponseSerializer.serialize(order),
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
                    error: "Error in getting orders.",
                });
            }
        }
    };

    static postOrder = async (req, res) => {
        //
    };

    static moveToCart = async (req, res) => {
        try {
            let products = await OrderService.moveToCart(
                req.user,
                req.params.orderId
            );

            if (products === null) {
                throw new ResourceNotFoundError("Order not found");
            }

            products = products.map((product) => {
                return ProductAPIResponseSerializer.serialize(product);
            });

            res.status(StatusCodes.MOVED_PERMANENTLY).json({
                success: true,
                products: products,
            });
        } catch (err) {
            console.log(err);
            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    error: "Order not found",
                });
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    error: "Error in moving order to cart.",
                });
            }
        }
    };

    static updateOrder = async (req, res) => {
        try {
            const orderInfo = {
                payment: req.body.payment,
                message: req.body.message,
            };

            const order = await OrderService.updatePaymentAndMessage(
                req.user.id,
                req.params.orderId,
                orderInfo
            );

            res.status(StatusCodes.OK).json({
                success: true,
                order: OrderAPIResponseSerializer.serialize(order),
            });
        } catch (err) {
            console.log(err);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: "Error in updating order.",
            });
        }
    };

    static deleteOrder = async (req, res) => {
        try {
            const result = await OrderService.deleteOrder(
                req.user.id,
                req.params.orderId
            );

            res.status(StatusCodes.OK).json({
                success: result,
            });
        } catch (err) {
            console.log(err);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: "Error in deleting order.",
            });
        }
    };

    static deleteAllOrders = async (req, res) => {
        try {
            const result = await OrderService.deleteAllOrders(req.user);

            res.status(StatusCodes.OK).json({
                success: result,
            });
        } catch (err) {
            console.log(err);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: "Error in deleting orders.",
            });
        }
    };
}

export { OrderController };
