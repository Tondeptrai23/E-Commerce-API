import seedData, { orderData, orderItemData, cartData } from "../setup.js";
import { OrderService } from "../../services/orderService.js";
import { Order } from "../../models/orderModel.js";
import { User } from "../../models/userModel.js";

beforeEach(async () => {
    await seedData();
});

describe("OrderService.getOrders", () => {
    test("should return all orders of a user", async () => {
        const user = await User.findOne({
            where: {
                id: "1",
            },
        });

        const orders = await OrderService.getOrders(user);

        expect(orders.length).toBe(2);
        expect(orders[0].id).toBe(orderData[0].id);
        expect(orders[1].id).toBe(orderData[1].id);
    });

    test("should return empty array if user doesn't have any orders", async () => {
        const user = await User.findOne({
            where: {
                id: "3",
            },
        });

        const orders = await OrderService.getOrders(user);

        expect(orders.length).toBe(0);
    });
});

describe("OrderService.getOrder", () => {
    test("should return order of a user by orderId", async () => {
        const userId = "1";
        const orderId = "1";

        const order = await OrderService.getOrder(userId, orderId);

        expect(order.id).toBe(orderData[0].id);
        expect(order.userID).toBe(orderData[0].userID);
        expect(order.products.length).toBe(2);
        expect(order.products[0].id).toBe(orderItemData[0].productID);
        expect(order.products[1].id).toBe(orderItemData[1].productID);
    });

    test("should return null if order not found", async () => {
        const userId = "1";
        const orderId = "3";

        const order = await OrderService.getOrder(userId, orderId);

        expect(order).toBeNull();
    });

    test("should return null if user doesn't have this order", async () => {
        const userId = "3";
        const orderId = "1";

        const order = await OrderService.getOrder(userId, orderId);

        expect(order).toBeNull();
    });
});

describe("OrderService.updatePaymentAndMessage", () => {
    test("should update the payment and message fields of an order", async () => {
        const userId = "1";
        const orderId = "1";
        const updateField = {
            payment: "Credit Card",
            message: "Please deliver to the front door.",
        };

        const updatedOrder = await OrderService.updatePaymentAndMessage(
            userId,
            orderId,
            updateField
        );

        expect(updatedOrder.payment).toBe(updateField.payment);
        expect(updatedOrder.message).toBe(updateField.message);
    });

    test("should return null if order not found", async () => {
        const userId = "1";
        const orderId = "4";
        const updateField = {
            payment: "Credit Card",
            message: "Please deliver to the front door.",
        };

        const result = await OrderService.updatePaymentAndMessage(
            userId,
            orderId,
            updateField
        );

        expect(result).toBeNull();
    });

    test("should return null if user doesn't have this order", async () => {
        const userId = "3";
        const orderId = "1";
        const updateField = {
            payment: "Credit Card",
            message: "Please deliver to the front door.",
        };

        const result = await OrderService.updatePaymentAndMessage(
            userId,
            orderId,
            updateField
        );

        expect(result).toBeNull();
    });
});

describe("OrderService.moveToCart", () => {
    test("should move an order to the user's cart", async () => {
        const user = await User.findOne({
            where: {
                id: "1",
            },
        });
        const orderId = "1";

        const cartItems = await OrderService.moveToCart(user, orderId);

        expect(cartItems.length).toBe(3);
        expect(cartItems[0].id).toBe(orderItemData[0].productID);
        expect(cartItems[1].id).toBe(orderItemData[1].productID);
        expect(cartItems[2].id).toBe(cartData[1].productID);
        expect(cartItems[0].cart.quantity).toBe(4);
        expect(cartItems[1].cart.quantity).toBe(36);
        expect(cartItems[2].cart.quantity).toBe(3);
    });

    test("should return null if order not found", async () => {
        const user = await User.findOne({
            where: {
                id: "1",
            },
        });

        const orderId = "3";

        const result = await OrderService.moveToCart(user, orderId);

        expect(result).toBeNull();
    });

    test("should return null if user doesn't have this order", async () => {
        const user = await User.findOne({
            where: {
                id: "3",
            },
        });

        const orderId = "1";

        const result = await OrderService.moveToCart(user, orderId);

        expect(result).toBeNull();
    });
});

describe("OrderService.deleteOrder", () => {
    test("should delete an order of a user", async () => {
        const userId = "1";
        const orderId = "1";

        const result = await OrderService.deleteOrder(userId, orderId);
        expect(result).toBe(true);

        const order = await Order.findOne({
            where: {
                id: orderId,
                userId: userId,
            },
        });
        expect(order).toBeNull();
    });

    test("should return null if order not found", async () => {
        const userId = "1";
        const orderId = "3";

        const result = await OrderService.deleteOrder(userId, orderId);
        expect(result).toBe(false);
    });

    test("should return false if user doesn't have this order", async () => {
        const userId = "3";
        const orderId = "1";

        const result = await OrderService.deleteOrder(userId, orderId);
        expect(result).toBe(false);
    });
});

describe("OrderService.deleteAllOrders", () => {
    test("should delete all orders of a user", async () => {
        const user = await User.findOne({
            where: {
                id: "1",
            },
        });

        await OrderService.deleteAllOrders(user);

        const orders = await Order.findAll({
            where: {
                userId: user.id,
            },
        });

        expect(orders.length).toBe(0);
    });

    test("should return false if user doesn't have any orders", async () => {
        const user = await User.findOne({
            where: {
                id: "3",
            },
        });

        const result = await OrderService.deleteAllOrders(user);
        expect(result).toBe(false);
    });
});
