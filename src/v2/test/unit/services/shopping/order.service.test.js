import orderService from "../../../../services/shopping/order.service.js";
import User from "../../../../models/user/user.model.js";
import seedData from "../../../../seedData.js";
import Order from "../../../../models/shopping/order.model.js";
import { ResourceNotFoundError } from "../../../../utils/error.js";
import ShippingAddress from "../../../../models/user/address.model.js";

let user;
beforeAll(async () => {
    await seedData();
    user = await User.findByPk(1);
}, 15000);

describe("OrderService", () => {
    describe("getPendingOrder", () => {
        test("should return the pending order of the user", async () => {
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
            const { orders, currentPage, totalPages, totalItems } =
                await orderService.getOrders(user);

            expect(orders).toBeDefined();
            expect(currentPage).toBe(1);
            expect(totalPages).toBeGreaterThan(0);
            expect(totalItems).toBeGreaterThan(0);
            expect(orders[0]).toBeInstanceOf(Order);
        });

        test("should return the orders of the user with pagination", async () => {
            const { orders, currentPage, totalPages, totalItems } =
                await orderService.getOrders(user, {
                    page: 1,
                    size: 2,
                });

            expect(orders).toBeDefined();
            expect(currentPage).toBe(1);
            expect(totalPages).toBeGreaterThan(0);
            expect(totalItems).toBeGreaterThan(0);
            expect(orders.length).toBe(2);
            expect(orders[0]).toBeInstanceOf(Order);

            const {
                orders: orders2,
                currentPage: currentPage2,
                totalPages: totalPages2,
                totalItems: totalItems2,
            } = await orderService.getOrders(user, {
                page: 2,
                size: 2,
            });

            expect(orders2).toBeDefined();
            expect(currentPage2).toBe(2);
            expect(totalPages2).toBeGreaterThan(0);
            expect(totalItems2).toBeGreaterThan(0);
            expect(orders2.length).toBeLessThanOrEqual(2);
        });

        test("should return the orders of the user with filtering", async () => {
            const { orders, currentPage, totalPages, totalItems } =
                await orderService.getOrders(user, {
                    status: "pending",
                });

            expect(currentPage).toBe(1);
            expect(totalPages).toBe(1);
            expect(totalItems).toBe(1);
            expect(orders[0]).toBeInstanceOf(Order);
            expect(orders[0].status).toBe("pending");
        });

        test("should return the orders of the user with filtering 2", async () => {
            const { orders } = await orderService.getOrders(user, {
                finalTotal: "[lte]100",
                status: "processing",
            });

            expect(orders[0]).toBeInstanceOf(Order);
            for (let i = 0; i < orders.length; i++) {
                expect(orders[i].finalTotal).toBeLessThanOrEqual(100);
                expect(orders[i].status).toBe("processing");
            }
        });

        test("should return the orders of the user with sorting", async () => {
            const user = await User.findByPk(1);

            const { orders } = await orderService.getOrders(user, {
                sort: ["finalTotal"],
            });

            expect(orders[0]).toBeInstanceOf(Order);
            for (let i = 0; i < orders.length - 1; i++) {
                expect(orders[i].finalTotal).toBeLessThanOrEqual(
                    orders[i + 1].finalTotal
                );
            }

            const { orders: orders2 } = await orderService.getOrders(user, {
                sort: ["finalTotal"],
                page: "2",
            });
            for (let i = 0; i < orders2.length - 1; i++) {
                expect(orders2[i].finalTotal).toBeLessThanOrEqual(
                    orders2[i + 1].finalTotal
                );
            }

            expect(orders[orders.length - 1].finalTotal).toBeLessThanOrEqual(
                orders2[0].finalTotal
            );
        });
    });

    describe("getAdminOrders", () => {
        test("should return the orders", async () => {
            const { orders, currentPage, totalPages, totalItems } =
                await orderService.getAdminOrders({
                    size: "20",
                });

            expect(orders).toBeDefined();
            expect(currentPage).toBe(1);
            expect(totalPages).toBeGreaterThan(0);
            expect(totalItems).toBeGreaterThan(0);
            expect(orders[0]).toBeInstanceOf(Order);
            expect(orders.some((order) => order.deletedAt)).toBe(true);
        });

        test("should return the orders with pagination", async () => {
            const { orders, currentPage, totalPages, totalItems } =
                await orderService.getAdminOrders({
                    page: 1,
                    size: 2,
                });

            expect(orders).toBeDefined();
            expect(currentPage).toBe(1);
            expect(totalPages).toBeGreaterThan(0);
            expect(totalItems).toBeGreaterThan(0);
            expect(orders.length).toBe(2);
            expect(orders[0]).toBeInstanceOf(Order);

            const {
                orders: orders2,
                currentPage: currentPage2,
                totalPages: totalPages2,
                totalItems: totalItems2,
            } = await orderService.getAdminOrders({
                page: 2,
                size: 2,
            });

            expect(orders2).toBeDefined();
            expect(currentPage2).toBe(2);
            expect(totalPages2).toBeGreaterThan(0);
            expect(totalItems2).toBeGreaterThan(0);
            expect(orders2.length).toBeLessThanOrEqual(2);
        });

        test("should return the orders with filtering", async () => {
            const { orders, currentPage, totalPages, totalItems } =
                await orderService.getAdminOrders({
                    status: "pending",
                });

            expect(currentPage).toBe(1);
            expect(totalPages).toBe(1);
            expect(totalItems).toBe(1);
            expect(orders[0]).toBeInstanceOf(Order);
            expect(orders[0].status).toBe("pending");
        });

        test("should return the orders with filtering 2", async () => {
            const { orders } = await orderService.getAdminOrders({
                finalTotal: "[lte]100",
                status: "processing",
            });

            expect(orders[0]).toBeInstanceOf(Order);
            for (let i = 0; i < orders.length; i++) {
                expect(orders[i].finalTotal).toBeLessThanOrEqual(100);
                expect(orders[i].status).toBe("processing");
            }

            const { orders: orders2 } = await orderService.getAdminOrders({
                finalTotal: "[gte]100",
                status: "processing",
            });

            expect(orders2[0]).toBeInstanceOf(Order);
            for (let i = 0; i < orders2.length; i++) {
                expect(orders2[i].finalTotal).toBeGreaterThanOrEqual(100);
                expect(orders2[i].status).toBe("processing");
            }
        });

        test("should return the orders with admin filtering", async () => {
            const { orders } = await orderService.getAdminOrders({
                shippingAddress: {
                    city: "[like]Ho Chi Minh",
                },
            });

            expect(orders[0]).toBeInstanceOf(Order);
            for (let i = 0; i < orders.length; i++) {
                expect(orders[i].shippingAddress.city).toMatch("Ho Chi Minh");
            }
        });

        test("should return the orders with admin filtering 2", async () => {
            const { orders } = await orderService.getAdminOrders({
                variant: {
                    variantID: ["102", "104"],
                },
            });

            expect(orders[0]).toBeInstanceOf(Order);

            for (let i = 0; i < orders.length; i++) {
                expect(["1", "4", "6", "7"]).toContain(orders[i].orderID);
            }
        });

        test("should return the orders with sorting", async () => {
            const { orders } = await orderService.getAdminOrders({
                sort: ["finalTotal"],
            });

            expect(orders[0]).toBeInstanceOf(Order);
            for (let i = 0; i < orders.length - 1; i++) {
                expect(orders[i].finalTotal).toBeLessThanOrEqual(
                    orders[i + 1].finalTotal
                );
            }

            const { orders: orders2 } = await orderService.getAdminOrders({
                sort: ["finalTotal"],
                page: "2",
            });
            for (let i = 0; i < orders2.length - 1; i++) {
                expect(orders2[i].finalTotal).toBeLessThanOrEqual(
                    orders2[i + 1].finalTotal
                );
            }

            expect(orders[orders.length - 1].finalTotal).toBeLessThanOrEqual(
                orders2[0].finalTotal
            );
        });
    });

    describe("getOrder", () => {
        test("should return the specific order for the user", async () => {
            const orderID = "1";

            const order = await orderService.getOrder(user, orderID);

            expect(order).toBeDefined();
            expect(order).toBeInstanceOf(Order);
            expect(order.orderID).toBe(orderID);
        });

        test("should throw ResourceNotFoundError if the order is not found", async () => {
            const orderID = "2";

            await expect(orderService.getOrder(user, orderID)).rejects.toThrow(
                ResourceNotFoundError
            );
        });
    });

    describe("getAdminOrder", () => {
        test("should return the specific order", async () => {
            const orderID = "1";

            const order = await orderService.getAdminOrder(orderID);

            expect(order).toBeDefined();
            expect(order).toBeInstanceOf(Order);
            expect(order.orderID).toBe(orderID);
        });

        test("should return the specific order even it's deleted", async () => {
            const orderID = "9";

            const order = await orderService.getAdminOrder(orderID);

            expect(order).toBeDefined();
            expect(order).toBeInstanceOf(Order);
            expect(order.orderID).toBe(orderID);
            expect(order.deletedAt).toBeDefined();
        });

        test("should throw ResourceNotFoundError if the order is not found", async () => {
            const orderID = "999";

            await expect(orderService.getAdminOrder(orderID)).rejects.toThrow(
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
            const orderID = "12";

            await expect(
                orderService.deleteOrder(user, orderID)
            ).rejects.toThrow(ResourceNotFoundError);
        });
    });

    describe("updateOrder", () => {
        test("should update the address of the user", async () => {
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
