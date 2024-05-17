import { Cart } from "../models/CartModel.js";
import { Order } from "../models/OrderModel.js";
import { Product } from "../models/ProductModel.js";
import { CartService } from "./CartService.js";

class OrderSerivce {
    static getOrders = async (user) => {
        const orders = await user.getOrders();
        return orders;
    };

    static getOrder = async (orderId) => {
        const order = await Order.findByPk(orderId, {
            include: [
                {
                    model: Product,
                    as: "product",
                    attributes: ["id", "name", "price"],
                    through: {
                        attributes: ["quantity"],
                    },
                },
            ],
            attributes: ["id", "isCheckedOut", "payment", "message"],
        });
        return order;
    };

    static updatePaymentAndMessage = async (orderId, updateField) => {
        const order = await this.getOrder(orderId);

        if (order) {
            order.message = updateField.message;
            order.payment = updateField.payment;
            order.save();
        }

        return order;
    };

    static moveToCart = async (user, orderId) => {
        const order = await this.getOrder(orderId);

        for (const product of order.product) {
            await CartService.addProduct(
                user,
                product.id,
                product["order-product"].quantity
            );
        }

        await this.deleteOrder(orderId);

        return CartService.getProducts(user);
    };

    static deleteOrder = async (orderId) => {
        const order = await this.getOrder(orderId);

        if (order) {
            await order.destroy();
        }

        return order;
    };

    static deleteAllOrders = async (user) => {
        const orders = await this.getOrders(user);

        for (const order of orders) {
            await order.destroy();
        }

        return true;
    };
}

export { OrderSerivce };
