import orderService from "../../../services/shopping/order.service.js";
import { User } from "../../../models/userOrder/user.model.js";
import seedData from "../../../seedData.js";
import { Order } from "../../../models/userOrder/order.model.js";
import { ResourceNotFoundError } from "../../../utils/error.js";
import { CartItem } from "../../../models/userOrder/cartItem.model.js";

beforeAll(async () => {
    await seedData();
});

describe("OrderService", () => {
    describe("getOrders", () => {
        test("should return the orders of the user", async () => {
            const user = await User.findByPk(1);

            const orders = await orderService.getOrders(user);

            expect(orders).toBeDefined();
            expect(orders).toBeInstanceOf(Array);
            expect(orders.length).toBeGreaterThan(0);
            expect(orders[0]).toBeInstanceOf(Order);
        });
    });

    // New test: getOrder
    describe("getOrder", () => {
        test("should return the specific order for the user", async () => {
            const user = await User.findByPk(1);
            const orderID = "1";

            const order = await orderService.getOrder(user, orderID);

            expect(order).toBeDefined();
            expect(order).toBeInstanceOf(Order);
            expect(order.orderID).toBe(orderID);
        });

        test("should throw ResourceNotFoundError if the order is not found", async () => {
            const user = await User.findByPk(1);
            const orderID = "2";

            await expect(orderService.getOrder(user, orderID)).rejects.toThrow(
                ResourceNotFoundError
            );
        });
    });

    // New test: postOrder
    describe("postOrder", () => {
        //
    });

    // New test: updateOrder
    describe("updateOrder", () => {
        test("should update the specified order for the user", async () => {
            const user = await User.findByPk(1);
            const orderID = "1";
            const orderData = { status: "delivered" };

            const updatedOrder = await orderService.updateOrder(
                user,
                orderID,
                orderData
            );

            expect(updatedOrder).toBeDefined();
            expect(updatedOrder).toBeInstanceOf(Order);
            expect(updatedOrder.orderID).toBe(orderID);
            expect(updatedOrder.status).toBe(orderData.status);
        });

        test("should throw ResourceNotFoundError if the order is not found", async () => {
            const user = await User.findByPk(1);
            const orderID = "12";
            const orderData = { status: "delivered" };

            await expect(
                orderService.updateOrder(user, orderID, orderData)
            ).rejects.toThrow(ResourceNotFoundError);
        });
    });

    // New test: moveToCart
    describe("moveToCart", () => {
        test("should move the specified order to cart for the user", async () => {
            const user = await User.findByPk(1);
            const orderID = "4";

            const cartItems = await orderService.moveToCart(user, orderID);

            expect(cartItems).toBeDefined();
            expect(cartItems).toBeInstanceOf(Array);
            expect(cartItems.length).toBeGreaterThan(0);
            expect(cartItems[0]).toBeInstanceOf(CartItem);

            // Verify that the order is deleted
            // Delay 1s
            await new Promise((resolve) => setTimeout(resolve, 1000));
            await expect(orderService.getOrder(user, orderID)).rejects.toThrow(
                ResourceNotFoundError
            );
        });

        test("should throw ResourceNotFoundError if the order is not found", async () => {
            const user = await User.findByPk(1);
            const orderID = "12";

            await expect(
                orderService.moveToCart(user, orderID)
            ).rejects.toThrow(ResourceNotFoundError);
        });
    });

    // New test: deleteOrder
    describe("deleteOrder", () => {
        test("should delete the specified order for the user", async () => {
            const user = await User.findByPk(1);
            const orderID = "1";

            await orderService.deleteOrder(user, orderID);

            // Verify that the order is deleted
            await expect(orderService.getOrder(user, orderID)).rejects.toThrow(
                ResourceNotFoundError
            );
        });

        test("should throw ResourceNotFoundError if the order is not found", async () => {
            const user = await User.findByPk(1);
            const orderID = "12";

            await expect(
                orderService.deleteOrder(user, orderID)
            ).rejects.toThrow(ResourceNotFoundError);
        });
    });

    // New test: deleteAllOrders
    describe("deleteAllOrders", () => {
        test("should delete all orders for the user", async () => {
            const user = await User.findByPk(1);

            await orderService.deleteAllOrders(user);

            // Verify that all orders are deleted
            const orders = await orderService.getOrders(user);
            expect(orders.length).toBe(0);
        });
    });
});
