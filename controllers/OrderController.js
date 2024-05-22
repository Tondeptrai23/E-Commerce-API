import {
    OrderAPIResponseSerializer,
    ProductAPIResponseSerializer,
} from "../services/APIResponseSerializer.js";
import { OrderSerivce } from "../services/OrderService.js";

class OrderController {
    static getOrders = async (req, res) => {
        try {
            const orders = await OrderSerivce.getOrders(req.user);

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
            const order = await OrderSerivce.getOrder(req.params.orderId);

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
            const products = await OrderSerivce.moveToCart(
                req.user,
                req.params.orderId
            );

            res.status(200).json({
                success: true,
                products: products.map((product) => {
                    return ProductAPIResponseSerializer.serialize(product);
                }),
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

            const order = await OrderSerivce.updatePaymentAndMessage(
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
            const order = await OrderSerivce.deleteOrder(req.params.orderId);

            res.status(200).json({
                success: true,
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
            const result = await OrderSerivce.deleteAllOrders(req.user);

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
