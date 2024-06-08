import { CartController } from "../../controllers/cartController.js";
import { db } from "../../models/index.js";
import seedData from "../setup.js";
import { User } from "../../models/userModel.js";

beforeEach(async () => {
    await seedData();
});

afterAll(async () => {
    await db.close();
});

describe("CartController.getCart", () => {
    test("should return cart products", async () => {
        const req = {
            user: await User.findOne({ where: { id: "1" } }),
        };
        const res = {
            status(responseStatus) {
                expect(responseStatus).toEqual(200);
                return this;
            },

            json({ success, products }) {
                expect(success).toEqual(true);
                expect(products).toHaveLength(2);
                expect(products[0].name).toEqual("Apple");
                expect(products[1].name).toEqual("Orange");
            },
        };

        await CartController.getCart(req, res);
    });

    test("should return an empty cart if no products are present", async () => {
        const req = {
            user: await User.findOne({ where: { id: "3" } }),
        };
        const res = {
            status(responseStatus) {
                expect(responseStatus).toEqual(200);
                return this;
            },

            json({ success, products }) {
                expect(success).toEqual(true);
                expect(products).toHaveLength(0);
            },
        };

        await CartController.getCart(req, res);
    });
});

describe("CartController.fetchCartToOrder", () => {
    test("should fetch cart and create order", async () => {
        const req = {
            user: await User.findOne({ where: { id: "1" } }),
            body: {
                productIDs: ["1", "3"],
            },
        };
        const res = {
            status(responseStatus) {
                expect(responseStatus).toEqual(201);
                return this;
            },

            json({ success, order }) {
                expect(success).toEqual(true);
                expect(order).toBeDefined();
                expect(order.products).toHaveLength(2);
                expect(order.products[0].name).toEqual("Apple");
                expect(order.products[1].name).toEqual("Orange");
            },
        };

        await CartController.fetchCartToOrder(req, res);
    });

    test("should return an error if products are not present in cart", async () => {
        const req = {
            user: await User.findOne({ where: { id: "1" } }),
            body: {
                productIDs: ["2"],
            },
        };
        const res = {
            status(responseStatus) {
                expect(responseStatus).toEqual(404);
                return this;
            },

            json({ success, error }) {
                expect(success).toEqual(false);
                expect(error).toEqual("Products not found in cart");
            },
        };

        await CartController.fetchCartToOrder(req, res);
    });
});

describe("CartController.updateProduct", () => {
    test("should update product in the cart", async () => {
        const req = {
            user: await User.findOne({ where: { id: "1" } }),
            body: {
                quantity: 3,
            },
            params: {
                productId: "1",
            },
        };
        const res = {
            status(responseStatus) {
                expect(responseStatus).toEqual(200);
                return this;
            },

            json(data) {
                expect(data.success).toEqual(true);
                expect(data.product.quantity).toEqual(3);
                expect(data.product.id).toEqual("1");
            },
        };

        await CartController.updateProduct(req, res);
    });

    test("should return an error if the product does not exist in the cart", async () => {
        const req = {
            user: await User.findOne({ where: { id: "1" } }),
            body: {
                quantity: 3,
            },
            params: {
                productId: "500",
            },
        };
        const res = {
            status(responseStatus) {
                expect(responseStatus).toEqual(404);
                return this;
            },

            json({ success, error }) {
                expect(success).toEqual(false);
                expect(error).toEqual("Product not found in cart");
            },
        };

        await CartController.updateProduct(req, res);
    });
});

describe("CartController.deleteProduct", () => {
    test("should delete product from the cart", async () => {
        const req = {
            user: await User.findOne({ where: { id: "1" } }),
            params: {
                productId: "1",
            },
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

        await CartController.deleteProduct(req, res);
    });

    test("should return an error if the product does not exist in the cart", async () => {
        const req = {
            user: await User.findOne({ where: { id: "1" } }),
            params: {
                productId: "500",
            },
        };
        const res = {
            status(responseStatus) {
                expect(responseStatus).toEqual(404);
                return this;
            },

            json({ success, error }) {
                expect(success).toEqual(false);
                expect(error).toEqual("Product not found in cart");
            },
        };

        await CartController.deleteProduct(req, res);
    });
});

describe("CartController.deleteCart", () => {
    test("should delete the entire cart", async () => {
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

        await CartController.deleteCart(req, res);
    });
});
