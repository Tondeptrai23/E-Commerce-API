import { OrderController } from "../../controllers/orderController.js";
import { db } from "../../models/index.js";
import seedData from "../setup.js";
import { User } from "../../models/userModel.js";
import { Order } from "../../models/orderModel.js";

beforeEach(async () => {
    await seedData();
});

afterAll(async () => {
    await db.close();
});

describe("OrderController.getOrders", () => {
    test("should return orders of the user", async () => {
        const req = {
            user: await User.findOne({ where: { id: "1" } }),
        };

        const res = {
            status(responseStatus) {
                expect(responseStatus).toEqual(200);
                return this;
            },

            json({ success, order }) {
                expect(success).toEqual(true);
                expect(order).toHaveLength(2);
                expect(order[0].id).toEqual("1");
                expect(order[1].id).toEqual("2");
            },
        };

        await OrderController.getOrders(req, res);
    });

    test("should return an empty array if user has no orders", async () => {
        const req = {
            user: await User.findOne({ where: { id: "3" } }),
        };

        const res = {
            status(responseStatus) {
                expect(responseStatus).toEqual(200);
                return this;
            },

            json({ success, order }) {
                expect(success).toEqual(true);
                expect(order).toHaveLength(0);
            },
        };

        await OrderController.getOrders(req, res);
    });
});

describe("OrderController.getOrder", () => {
    test("should return the order with the specified ID", async () => {
        const req = {
            user: await User.findOne({ where: { id: "1" } }),
            params: { orderId: "1" },
        };

        const res = {
            status(responseStatus) {
                expect(responseStatus).toEqual(200);
                return this;
            },

            json({ success, order }) {
                expect(success).toEqual(true);
                expect(order.id).toEqual("1");
            },
        };

        await OrderController.getOrder(req, res);
    });

    test("should return a 404 error if the order does not exist", async () => {
        const req = {
            user: await User.findOne({ where: { id: "1" } }),
            params: { orderId: "999" },
        };

        const res = {
            status(responseStatus) {
                expect(responseStatus).toEqual(404);
                return this;
            },

            json({ success, error }) {
                expect(success).toEqual(false);
                expect(error).toEqual("Order not found");
            },
        };

        await OrderController.getOrder(req, res);
    });
});

// describe("OrderController.postOrder", () => {
//     // Not implemented yet
// });

describe("OrderController.moveToCart", () => {
    test("should move the order to the cart", async () => {
        const req = {
            user: await User.findOne({ where: { id: "1" } }),
            params: { orderId: "1" },
        };

        const res = {
            status(responseStatus) {
                expect(responseStatus).toEqual(200);
                return this;
            },

            json({ success, products }) {
                expect(success).toEqual(true);
                expect(products).toHaveLength(3);
                expect(products[0].id).toEqual("1");
                expect(products[1].id).toEqual("2");
                expect(products[2].id).toEqual("3");
            },
        };

        await OrderController.moveToCart(req, res);
    });

    test("should return a 404 error if the order does not exist", async () => {
        const req = {
            user: await User.findOne({ where: { id: "1" } }),
            params: { orderId: "999" },
        };

        const res = {
            status(responseStatus) {
                expect(responseStatus).toEqual(404);
                return this;
            },

            json({ success, error }) {
                expect(success).toEqual(false);
                expect(error).toEqual("Order not found");
            },
        };

        await OrderController.moveToCart(req, res);
    });
});

describe("OrderController.updateOrder", () => {
    test("should update the order with the specified ID", async () => {
        const req = {
            user: await User.findOne({ where: { id: "1" } }),
            params: { orderId: "1" },
            body: { payment: "Paypal", message: "Please deliver fast" },
        };

        const res = {
            status(responseStatus) {
                expect(responseStatus).toEqual(200);
                return this;
            },

            json({ success, order }) {
                expect(success).toEqual(true);
                expect(order.id).toEqual("1");
                expect(order.payment).toEqual("Paypal");
                expect(order.message).toEqual("Please deliver fast");
            },
        };

        await OrderController.updateOrder(req, res);
    });

    test("should return a 404 error if the order does not exist", async () => {
        const req = {
            user: await User.findOne({ where: { id: "1" } }),
            params: { orderId: "999" },
            body: { payment: "Paypal", message: "Please deliver fast" },
        };

        const res = {
            status(responseStatus) {
                expect(responseStatus).toEqual(404);
                return this;
            },

            json({ success, error }) {
                expect(success).toEqual(false);
                expect(error).toEqual("Order not found");
            },
        };

        await OrderController.updateOrder(req, res);
    });
});

describe("OrderController.deleteOrder", () => {
    test("should delete the order with the specified ID", async () => {
        const req = {
            user: await User.findOne({ where: { id: "1" } }),
            params: { orderId: "1" },
        };

        const res = {
            status(responseStatus) {
                expect(responseStatus).toEqual(200);
                return this;
            },

            json({ success }) {
                expect(success).toEqual(true);
            },
        };

        await OrderController.deleteOrder(req, res);
    });

    test("should return a 404 error if order doesn't exists", async () => {
        const req = {
            user: await User.findOne({ where: { id: "1" } }),
            params: { orderId: "999" },
        };

        const res = {
            status(responseStatus) {
                expect(responseStatus).toEqual(404);
                return this;
            },

            json({ success, error }) {
                expect(success).toEqual(false);
                expect(error).toEqual("Order not found");
            },
        };

        await OrderController.getOrder(req, res);
    });
});

describe("OrderController.deleteAllOrders", () => {
    test("should delete all orders of the user", async () => {
        const req = {
            user: await User.findOne({ where: { id: "1" } }),
        };

        const res = {
            status(responseStatus) {
                expect(responseStatus).toEqual(200);
                return this;
            },

            json({ success }) {
                expect(success).toEqual(true);
            },
        };

        await OrderController.deleteAllOrders(req, res);
    });
});
