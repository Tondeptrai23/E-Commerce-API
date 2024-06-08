import { Order } from "../models/orderModel.js";
import { Product } from "../models/productModel.js";
import { CartService } from "./cartService.js";

class OrderService {
    static getOrders = async (user) => {
        const orders = await user.getOrders({
            attributes: {
                exclude: ["updatedAt", "createdAt"],
            },
        });
        return orders;
    };

    static getOrder = async (userId, orderId) => {
        const order = await Order.findOne({
            attributes: {
                exclude: ["updatedAt", "createdAt", "userId"],
            },
            include: [
                {
                    model: Product,
                    as: "products",
                    attributes: {
                        exclude: ["updatedAt", "createdAt"],
                    },
                    through: {
                        attributes: ["quantity"],
                    },
                },
            ],
            where: {
                id: orderId,
                userID: userId,
            },
        });
        return order;
    };

    static updatePaymentAndMessage = async (userId, orderId, updateField) => {
        const order = await this.getOrder(userId, orderId);
        if (order === null) return null;

        if (updateField.payment !== undefined) {
            order.payment = updateField.payment;
        }
        if (updateField.message !== undefined) {
            order.message = updateField.message;
        }

        return order;
    };

    static moveToCart = async (user, orderId) => {
        const order = await this.getOrder(user.id, orderId);

        if (order === null) {
            return null;
        }

        for (const product of order.products) {
            await CartService.addProduct(
                user,
                product.id,
                product.orderProduct.quantity
            );
        }

        await this.deleteOrder(user.id, orderId);

        return CartService.getProducts(user);
    };

    static deleteOrder = async (userId, orderId) => {
        const order = await this.getOrder(userId, orderId);

        if (order) {
            await order.destroy();
            return true;
        }

        return false;
    };

    static deleteAllOrders = async (user) => {
        const orders = await user.getOrders();
        if (orders.length === 0) return false;

        for (const order of orders) {
            await order.destroy();
        }
        return true;
    };
}

export { OrderService };
