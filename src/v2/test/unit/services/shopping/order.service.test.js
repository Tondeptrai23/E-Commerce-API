import orderService from "../../../../services/shopping/order.service.js";
import User from "../../../../models/user/user.model.js";
import seedData from "../../../../seedData.js";
import Order from "../../../../models/shopping/order.model.js";
import {
    ConflictError,
    ResourceNotFoundError,
} from "../../../../utils/error.js";
import ShippingAddress from "../../../../models/shopping/shippingAddress.model.js";
import OrderItem from "../../../../models/shopping/orderItem.model.js";
import Variant from "../../../../models/products/variant.model.js";
import { expect, jest } from "@jest/globals";
import CartItem from "../../../../models/shopping/cartItem.model.js";

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
            const user = await User.findByPk(3);

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
                finalTotal: "[lte]10000",
                status: "processing",
            });

            expect(orders[0]).toBeInstanceOf(Order);
            for (let i = 0; i < orders.length; i++) {
                expect(orders[i].finalTotal).toBeLessThanOrEqual(10000);
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
                finalTotal: "[lte]10000",
                status: "processing",
            });

            expect(orders[0]).toBeInstanceOf(Order);
            for (let i = 0; i < orders.length; i++) {
                expect(orders[i].finalTotal).toBeLessThanOrEqual(10000);
                expect(orders[i].status).toBe("processing");
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
            expect(order.shippingAddress).toBeInstanceOf(ShippingAddress);
            expect(order.message).toBe("New message");
        });

        test("should update the address", async () => {
            const addressID = "102";
            const order = await orderService.updateOrder(
                await orderService.getPendingOrder(user),
                {
                    address: {
                        city: "Ho Chi Minh",
                        district: "District 1",
                        recipientName: "John Doe",
                        phoneNumber: "123456789",
                        address: "123 Street",
                    },
                }
            );

            expect(order).toBeDefined();
            expect(order).toBeInstanceOf(Order);
            expect(order.shippingAddress).toBeInstanceOf(ShippingAddress);
            expect(order.shippingAddress.city).toBe("Ho Chi Minh");
            expect(order.shippingAddress.district).toBe("District 1");
            expect(order.shippingAddress.recipientName).toBe("John Doe");
            expect(order.shippingAddress.phoneNumber).toBe("123456789");
            expect(order.shippingAddress.address).toBe("123 Street");
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

    describe("createAdminOrder", () => {
        test("should create an order for admin with valid data", async () => {
            const variants = [
                { variantID: "101", quantity: 2 },
                { variantID: "102", quantity: 1 },
            ];
            const couponCode = "WINTER5";

            let existingStocks = await Promise.all(
                variants.map(
                    async (variant) => await Variant.findByPk(variant.variantID)
                )
            );

            const order = await orderService.createAdminOrder(
                variants,
                couponCode
            );

            expect(order).toBeDefined();
            expect(order).toBeInstanceOf(Order);
            expect(order.status).toBe("pending");
            expect(order.subTotal).toBeGreaterThan(0);
            expect(order.finalTotal).toBeGreaterThan(0);
            expect(order.coupon.code).toBe(couponCode);

            // Verify that the stock is updated
            for (const variant of variants) {
                const expectedStock =
                    existingStocks.find(
                        (stock) => stock.variantID === variant.variantID
                    ).stock - variant.quantity;
                const updatedStock = await Variant.findByPk(variant.variantID);
                expect(updatedStock.stock).toBe(expectedStock);
            }
        });

        test("should throw ResourceNotFoundError if a variant is not found", async () => {
            const variants = [
                { variantID: "999", quantity: 2 },
                { variantID: "102", quantity: 1 },
            ];
            const couponCode = "DISCOUNT10";
            await expect(
                orderService.createAdminOrder(variants, couponCode)
            ).rejects.toThrow(ResourceNotFoundError);
        });

        test("should throw ConflictError if a variant is out of stock", async () => {
            const variants = [
                { variantID: "101", quantity: 1000 },
                { variantID: "102", quantity: 1 },
            ];
            const couponCode = "DISCOUNT10";

            await expect(
                orderService.createAdminOrder(variants, couponCode)
            ).rejects.toThrow(ConflictError);
        });
    });

    describe("checkOutOrder", () => {
        test("should check out the order for the user", async () => {
            const order = await orderService.getPendingOrder(user);
            const variants = order.products;

            const newOrder = await orderService.checkOutOrder(user, "Momo");

            expect(newOrder).toBeDefined();
            expect(newOrder).toBeInstanceOf(Order);
            expect(newOrder.status).toBe("awaiting payment");
            expect(newOrder.paymentMethod).toBe("Momo");
            expect(newOrder.orderDate).toBeDefined();

            // Verify that the stock is updated
            for (const variant of variants) {
                const expectedStock =
                    variant.stock - variant.orderItem.quantity;
                const updatedStock = await Variant.findByPk(variant.variantID);
                expect(updatedStock.stock).toBe(expectedStock);
            }
        });

        test("should not check out the order if something goes wrong", async () => {
            const user = await User.findByPk(2);

            jest.spyOn(CartItem, "destroy").mockImplementation(() => {
                throw new Error();
            });

            const order = await orderService.getPendingOrder(user);
            const variants = order.products;

            await expect(
                orderService.checkOutOrder(user, "Momo")
            ).rejects.toThrow();

            jest.restoreAllMocks();

            // Verify that the order is not checked out
            const newOrder = await orderService.getPendingOrder(user);

            expect(newOrder).toBeDefined();
            expect(newOrder).toBeInstanceOf(Order);
            expect(newOrder.status).toBe("pending");

            // Verify that the stock is not updated
            for (const variant of variants) {
                const expectedStock = variant.stock;
                const updatedStock = await Variant.findByPk(variant.variantID);
                expect(updatedStock.stock).toBe(expectedStock);
            }
        });

        test("should still update the stock if concurrent requests are made", async () => {
            const order = await Order.bulkCreate([
                {
                    orderID: "300",
                    userID: "3",
                    status: "pending",
                    paymentMethod: "Momo",
                    orderDate: new Date(),
                    shippingAddressID: "101",
                },
                {
                    orderID: "400",
                    userID: "4",
                    status: "pending",
                    paymentMethod: "Momo",
                    orderDate: new Date(),
                    shippingAddressID: "101",
                },
            ]);

            await OrderItem.bulkCreate([
                {
                    orderID: "300",
                    variantID: "105",
                    quantity: 4,
                    priceAtPurchase: 100,
                },
                {
                    orderID: "400",
                    variantID: "105",
                    quantity: 6,
                    priceAtPurchase: 100,
                },
            ]);

            const oldStock = (await Variant.findByPk("105")).stock;

            await Promise.all([
                orderService.checkOutOrder(await User.findByPk("3"), "Momo"),
                orderService.checkOutOrder(await User.findByPk("4"), "Momo"),
            ]);

            // Verify that the stock is updated
            const updatedStock = (await Variant.findByPk("105")).stock;
            expect(updatedStock).toBe(oldStock - 10);
        });

        test("should throw ConflictError if order doesn't have shipping address", async () => {
            const user = await User.findByPk(2);

            await Order.create({
                orderID: "234",
                userID: "2",
                status: "pending",
                paymentMethod: "Momo",
                orderDate: new Date(),
            });

            await OrderItem.create({
                orderID: "234",
                variantID: "101",
                quantity: 1,
                priceAtPurchase: 100,
            });

            await expect(
                orderService.checkOutOrder(user, "Momo")
            ).rejects.toThrow(ConflictError);
        });

        test("should throw ConflictError if one of the order's variant is out of stock", async () => {
            await Order.create({
                orderID: "123",
                userID: "1",
                status: "pending",
                paymentMethod: "Momo",
                orderDate: new Date(),
                shippingAddressID: "101",
            });

            await OrderItem.bulkCreate([
                {
                    orderID: "123",
                    variantID: "105",
                    quantity: 100,
                    priceAtPurchase: 100,
                },
                {
                    orderID: "123",
                    variantID: "101",
                    quantity: 1,
                    priceAtPurchase: 100,
                },
            ]);

            const oldStock = (await Variant.findByPk("101")).stock;

            await expect(
                orderService.checkOutOrder(user, "Momo")
            ).rejects.toThrow(ConflictError);

            // Verify that the stock is not updated
            const updatedStock = (await Variant.findByPk("101")).stock;
            expect(updatedStock).toBe(oldStock);
        });

        test("should update 1 order in case of concurrent requests when out of stock", async () => {
            const order = await Order.bulkCreate([
                {
                    orderID: "101",
                    userID: "1",
                    status: "pending",
                    paymentMethod: "Momo",
                    orderDate: new Date(),
                    shippingAddressID: "101",
                },
                {
                    orderID: "301",
                    userID: "3",
                    status: "pending",
                    paymentMethod: "Momo",
                    orderDate: new Date(),
                    shippingAddressID: "101",
                },
                {
                    orderID: "401",
                    userID: "4",
                    status: "pending",
                    paymentMethod: "Momo",
                    orderDate: new Date(),
                    shippingAddressID: "101",
                },
            ]);

            await OrderItem.bulkCreate([
                {
                    orderID: "101",
                    variantID: "106",
                    quantity: 20,
                    priceAtPurchase: 100,
                },
                {
                    orderID: "301",
                    variantID: "106",
                    quantity: 23,
                    priceAtPurchase: 100,
                },
                {
                    orderID: "401",
                    variantID: "106",
                    quantity: 24,
                    priceAtPurchase: 100,
                },
            ]);

            try {
                await Promise.all([
                    orderService.checkOutOrder(
                        await User.findByPk("1"),
                        "Momo"
                    ),
                    orderService.checkOutOrder(
                        await User.findByPk("4"),
                        "Momo"
                    ),
                    orderService.checkOutOrder(
                        await User.findByPk("3"),
                        "Momo"
                    ),
                ]);
            } catch (error) {
                expect(error).toBeInstanceOf(ConflictError);
            }

            // Verify that the stock is greater than 0
            const updatedStock = (await Variant.findByPk("106")).stock;
            expect(updatedStock).toBeGreaterThan(0);

            // Verify only 1 order is checked out
            const checkedOutOrders = await Order.findAll({
                where: {
                    status: "awaiting payment",
                    orderID: ["101", "301", "401"],
                },
            });
            expect(checkedOutOrders.length).toBe(1);
        });
    });

    describe("handleFailedPayment", () => {
        test("should handle the failed payment for the order", async () => {
            const oldOrder = await Order.findOne({
                where: {
                    orderID: "1",
                },
                include: {
                    model: Variant,
                    as: "products",
                },
            });

            const order = await orderService.handleFailedPayment(
                oldOrder.orderID
            );

            expect(order).toBeDefined();
            expect(order).toBeInstanceOf(Order);
            expect(order.status).toBe("cancelled");

            // Verify that the stock is updated
            for (const variant of oldOrder.products) {
                const expectedStock =
                    variant.stock + variant.orderItem.quantity;
                const updatedStock = await Variant.findByPk(variant.variantID);
                expect(updatedStock.stock).toBe(expectedStock);
            }
        });

        test("should throw ResourceNotFoundError if the order is not found", async () => {
            const orderID = "124912498";

            await expect(
                orderService.handleFailedPayment(orderID)
            ).rejects.toThrow(ResourceNotFoundError);
        });

        test("should throw ConflictError if the order is not awaiting payment", async () => {
            const order = await Order.findOne({
                where: {
                    status: "pending",
                },
            });

            await expect(
                orderService.handleFailedPayment(order.orderID)
            ).rejects.toThrow(ConflictError);
        });

        test("should not update the status if something goes wrong", async () => {
            const oldOrder = await Order.findOne({
                where: {
                    status: "awaiting payment",
                },
            });

            jest.spyOn(Variant, "update").mockImplementation(() => {
                throw new Error();
            });

            await expect(
                orderService.handleFailedPayment(oldOrder.orderID)
            ).rejects.toThrow();

            jest.restoreAllMocks();

            const newOrder = await Order.findByPk(oldOrder.orderID);

            expect(newOrder).toBeDefined();
            expect(newOrder).toBeInstanceOf(Order);
            expect(newOrder.status).toBe("awaiting payment");
        });
    });

    describe("deleteOrder", () => {
        test("should permanently delete the cancelled order for the user", async () => {
            const order = await Order.findOne({
                where: {
                    status: "cancelled",
                    userID: user.userID,
                },
            });

            const orderID = order.orderID;

            await orderService.deleteOrder(user, orderID);

            const deletedOrder = await Order.findByPk(orderID, {
                paranoid: false,
            });

            expect(deletedOrder).toBeNull();
        });

        test("should permanently delete the pending order for the user", async () => {
            const order = await Order.findOne({
                where: {
                    status: "pending",
                    userID: user.userID,
                },
            });

            const orderID = order.orderID;

            await orderService.deleteOrder(user, orderID);

            const deletedOrder = await Order.findByPk(orderID, {
                paranoid: false,
            });

            expect(deletedOrder).toBeNull();
        });

        test("should throw ConflictError if the order is processing", async () => {
            const order = await Order.findOne({
                where: {
                    status: "processing",
                    userID: user.userID,
                },
            });

            const orderID = order.orderID;

            await expect(
                orderService.deleteOrder(user, orderID)
            ).rejects.toThrow(ConflictError);
        });

        test("should throw ConflictError if the order is awaiting payment", async () => {
            const order = await Order.findOne({
                where: {
                    status: "awaiting payment",
                    userID: user.userID,
                },
            });

            const orderID = order.orderID;

            await expect(
                orderService.deleteOrder(user, orderID)
            ).rejects.toThrow(ConflictError);
        });

        test("should phantoms delete the order if it is delivered", async () => {
            const order = await Order.findOne({
                where: {
                    status: "delivered",
                    userID: user.userID,
                },
            });

            const orderID = order.orderID;

            await orderService.deleteOrder(user, orderID);

            const deletedOrder = await Order.findByPk(orderID, {
                paranoid: false,
            });

            expect(deletedOrder).toBeDefined();
            expect(deletedOrder).toBeInstanceOf(Order);
            expect(deletedOrder.deletedAt).toBeDefined();
        });

        test("should throw ResourceNotFoundError if the order is not found", async () => {
            const orderID = "12";

            await expect(
                orderService.deleteOrder(user, orderID)
            ).rejects.toThrow(ResourceNotFoundError);
        });
    });
});
