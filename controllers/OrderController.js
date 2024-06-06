import {
    OrderAPIResponseSerializer,
    ProductAPIResponseSerializer,
} from "../utils/apiResponseSerializer.js";
import { OrderService } from "../services/orderService.js";

class OrderController {
    static getOrders = async (req, res) => {
        try {
            const orders = await OrderService.getOrders(req.user);

            if (orders === null || orders.length === 0) {
                res.status(400).json({
                    success: false,
                    error: "User doesn't have any orders!",
                });
                return;
            }

            // Format Data
            for (let order of orders) {
                order = OrderAPIResponseSerializer.serialize(order);
            }

            res.status(200).json({
                success: true,
                order: orders,
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({
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
                res.status(400).json({
                    success: false,
                    error: "Order not found!",
                });
                return;
            }

            res.status(200).json({
                success: true,
                order: OrderAPIResponseSerializer.serialize(order),
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                success: false,
                error: "Error in getting orders.",
            });
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
                res.status(400).json({
                    success: false,
                    error: "Order not found",
                });
                return;
            }

            products = products.map((product) => {
                return ProductAPIResponseSerializer.serialize(product);
            });

            res.status(200).json({
                success: true,
                products: products,
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                success: false,
                error: "Error in moving order to cart.",
            });
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

            res.status(200).json({
                success: true,
                order: OrderAPIResponseSerializer.serialize(order),
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({
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

            res.status(200).json({
                success: result,
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                success: false,
                error: "Error in deleting order.",
            });
        }
    };

    static deleteAllOrders = async (req, res) => {
        try {
            const result = await OrderService.deleteAllOrders(req.user);

            res.status(200).json({
                success: result,
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                success: false,
                error: "Error in deleting orders.",
            });
        }
    };
}

export { OrderController };
