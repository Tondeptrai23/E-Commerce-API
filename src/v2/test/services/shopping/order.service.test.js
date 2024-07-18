import orderService from "../../../services/shopping/order.service.js";
import User from "../../../models/userOrder/user.model.js";
import seedData from "../../../seedData.js";
import Order from "../../../models/userOrder/order.model.js";
import { ResourceNotFoundError } from "../../../utils/error.js";
import CartItem from "../../../models/userOrder/cartItem.model.js";
import ShippingAddress from "../../../models/userOrder/address.model.js";

beforeAll(async () => {
    await seedData();
}, 15000);

describe("OrderService", () => {
    describe("getPendingOrder", () => {
        test("should return the pending order of the user", async () => {
            const user = await User.findByPk(1);

            const order = await orderService.getPendingOrder(user);

            expect(order).toBeDefined();
            expect(order).toBeInstanceOf(Order);
            expect(order.status).toBe("pending");
        });

        test("should throw ResourceNotFoundError if the order is not found", async () => {
            const user = await User.findByPk(2);

            await expect(orderService.getPendingOrder(user)).rejects.toThrow(
                ResourceNotFoundError
            );
        });
    });

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

    describe("postOrder", () => {
        //
    });

    describe("deleteOrder", () => {
        test("should delete the specified order for the user", async () => {
            const user = await User.findByPk(2);
            const orderID = "2";

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

    describe("deleteAllOrders", () => {
        test("should delete all orders for the user", async () => {
            const user = await User.findByPk(3);

            await orderService.deleteAllOrders(user);

            // Verify that all orders are deleted
            const orders = await orderService.getOrders(user);
            expect(orders.length).toBe(0);
        });
    });

    describe("updateOrder", () => {
        test("should update the address of the user", async () => {
            const user = await User.findByPk(1);
            const addressID = "102";

            const order = await orderService.updateOrder(
                await orderService.getPendingOrder(user),
                {
                    addressID,
                    message: "New message",
                }
            );

            expect(order).toBeDefined();
            expect(order).toBeInstanceOf(Order);
            expect(order.dataValues.shippingAddress).toBeInstanceOf(
                ShippingAddress
            );
            expect(order.message).toBe("New message");
        });

        test("should throw ResourceNotFoundError if the address is not found", async () => {
            const user = await User.findByPk(1);
            const addressID = "123";

            await expect(
                orderService.updateOrder(
                    await orderService.getPendingOrder(user),
                    {
                        addressID,
                    }
                )
            ).rejects.toThrow(ResourceNotFoundError);
        });
    });
});
