import request from "supertest";
import { StatusCodes } from "http-status-codes";
import app from "../../../../../app.js";
import seedData from "../../../../../seedData.js";
import {
    assertTokenNotProvided,
    assertTokenInvalid,
} from "../../utils.integration.js";
import userService from "../../../../../services/users/user.service.js";
import { expect, jest } from "@jest/globals";
import MomoPayment from "../../../../../services/payment/momoPayment.service.js";
import orderService from "../../../../../services/shopping/order.service.js";
import ShippingAddress from "../../../../../models/shopping/shippingAddress.model.js";
import Variant from "../../../../../models/products/variant.model.js";
import { paymentConfig } from "../../../../../config/config.js";
import StripePayment from "../../../../../services/payment/stripePayment.service.js";
import Address from "../../../../../models/user/address.model.js";
import { db } from "../../../../../models/index.model.js";

/**
 * Set up
 *
 */
let accessToken = "";
let accessTokenUser = "";
let newUser;
beforeAll(async () => {
    // Seed data
    await seedData();

    // Get access token
    const res = await request(app).post("/api/v2/auth/signin").send({
        email: "admin@gmail.com",
        password: "adminpassword",
    });
    accessToken = res.body.accessToken;

    await userService.createNewAccount({
        userID: "123",
        email: "test@gmail.com",
        password: "testpassword",
        isVerified: true,
    });

    //Delay 1s
    await new Promise((r) => setTimeout(r, 1000));
    await Address.create({
        userID: "123",
        address: "123 Duong Ching",
        city: "Ha Noi",
        district: "Hoan Kiem",
        phoneNumber: "123456789",
        recipientName: "User 123",
        isDefault: true,
    });

    const resUser = await request(app).post("/api/v2/auth/signin").send({
        email: "test@gmail.com",
        password: "testpassword",
    });
    accessTokenUser = resUser.body.accessToken;

    newUser = await userService.findUserByEmail("test@gmail.com");

    // Mocking
    jest.spyOn(MomoPayment.prototype, "createPaymentUrl").mockImplementation(
        () => {
            return {
                paymentUrl: "https://momo.vn",
                orderID: "123",
                amount: "10000",
            };
        }
    );

    jest.spyOn(StripePayment.prototype, "createPaymentUrl").mockImplementation(
        () => {
            return {
                paymentUrl: "https://stripe.vn",
                orderID: "123",
                amount: "10000",
            };
        }
    );

    jest.spyOn(StripePayment, "getOrderIDFromPaymentIntent").mockImplementation(
        (orderID) => {
            return orderID;
        }
    );
});

afterEach(async () => {
    try {
        // Delete pending order of new user
        const pendingOrder = await orderService.getPendingOrder(newUser);

        await orderService.deleteOrder(newUser, pendingOrder.orderID);
    } catch (err) {
        //
    }
});

afterAll(async () => {
    await db.close();
    jest.restoreAllMocks();
});

/**
 * Tests
 */
describe("POST /api/v2/orders/pending", () => {
    it("should return 200 and create processing order", async () => {
        // Add new item to cart
        await request(app)
            .post("/api/v2/cart/102")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                quantity: 1,
            });

        // Create pending order
        await request(app)
            .post("/api/v2/cart")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                variantIDs: ["102"],
            });

        const res = await request(app)
            .post("/api/v2/orders/pending")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                payment: "COD",
            });

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            order: expect.objectContaining({
                orderID: expect.any(String),
                paymentMethod: "COD",
                status: "processing",
                finalTotal: 800,
            }),
        });
        expect(res.body.paymentUrl).toBeUndefined();
    });

    it("should return 200 and create awaiting payment order with MoMo", async () => {
        // Add new item to cart
        await request(app)
            .post("/api/v2/cart/103")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                quantity: 10,
            });

        // Get stock
        const stock = (await Variant.findByPk("103")).stock;

        // Create pending order
        await request(app)
            .post("/api/v2/cart")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                variantIDs: ["103"],
            });

        const res = await request(app)
            .post("/api/v2/orders/pending")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                payment: "momo",
            });

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            order: expect.objectContaining({
                orderID: expect.any(String),
                paymentMethod: "Momo",
                status: "awaiting payment",
                finalTotal: 12000,
            }),
            paymentUrl: "https://momo.vn",
        });

        // Check stock
        const newStock = (await Variant.findByPk("103")).stock;
        expect(newStock).toBe(stock - 10);
    });

    it("should return 200 and create awaiting payment order with MoMo, also notify if success", async () => {
        // Add new item to cart
        await request(app)
            .post("/api/v2/cart/103")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                quantity: 5,
            });

        // Get stock
        const stock = (await Variant.findByPk("103")).stock;

        // Create pending order
        await request(app)
            .post("/api/v2/cart")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                variantIDs: ["103"],
            });

        const res = await request(app)
            .post("/api/v2/orders/pending")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                payment: "momo",
                notify: true,
            });

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                paymentUrl: "https://momo.vn",
            })
        );

        // Check stock
        const newStock = (await Variant.findByPk("103")).stock;
        expect(newStock).toBe(stock - 5);

        // Notify
        const order = res.body.order;
        const resNotify = await request(app)
            .post("/api/v2/payment/momo/notify")
            .send({
                orderId: order.orderID,
                amount: order.finalTotal,
                partnerCode: paymentConfig.momo.PARTNER_CODE,
                resultCodes: 0,
                requestId: "random_string",
            });

        expect(resNotify.status).toBe(StatusCodes.NO_CONTENT);
    });

    it("should return 200 and create awaiting payment order with MoMo, also notify if failed", async () => {
        // Add new item to cart
        await request(app)
            .post("/api/v2/cart/103")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                quantity: 5,
            });

        // Get stock
        const stock = (await Variant.findByPk("103")).stock;

        // Create pending order
        await request(app)
            .post("/api/v2/cart")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                variantIDs: ["103"],
            });

        const res = await request(app)
            .post("/api/v2/orders/pending")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                payment: "momo",
                notify: true,
            });

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                paymentUrl: "https://momo.vn",
            })
        );

        // Check stock
        const newStock = (await Variant.findByPk("103")).stock;
        expect(newStock).toBe(stock - 5);

        // Notify
        const order = res.body.order;
        const resNotify = await request(app)
            .post("/api/v2/payment/momo/notify")
            .send({
                orderId: order.orderID,
                amount: order.finalTotal,
                partnerCode: paymentConfig.momo.PARTNER_CODE,
                resultCodes: 1,
                requestId: "random_string",
            });

        expect(resNotify.status).toBe(StatusCodes.NO_CONTENT);

        // Check stock
        const newStock2 = (await Variant.findByPk("103")).stock;
        expect(newStock2).toBe(stock);
    });

    it("should return 200 and create awaiting payment order with Credit Card", async () => {
        // Add new item to cart
        await request(app)
            .post("/api/v2/cart/103")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                quantity: 5,
            });

        // Get stock
        const stock = (await Variant.findByPk("103")).stock;

        // Create pending order
        await request(app)
            .post("/api/v2/cart")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                variantIDs: ["103"],
            });

        const res = await request(app)
            .post("/api/v2/orders/pending")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                payment: "credit_card",
            });

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            order: expect.objectContaining({
                orderID: expect.any(String),
                paymentMethod: "CreditCard",
                status: "awaiting payment",
                finalTotal: 6000,
            }),
            paymentUrl: expect.any(String),
        });

        // Check stock
        const newStock = (await Variant.findByPk("103")).stock;
        expect(newStock).toBe(stock - 5);
    });

    it("should return 200 and create awaiting payment order with Credit Card, also notify if success", async () => {
        // Add new item to cart
        await request(app)
            .post("/api/v2/cart/103")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                quantity: 5,
            });

        // Get stock
        const stock = (await Variant.findByPk("103")).stock;

        // Create pending order
        await request(app)
            .post("/api/v2/cart")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                variantIDs: ["103"],
            });

        const res = await request(app)
            .post("/api/v2/orders/pending")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                payment: "credit_card",
                notify: true,
            });

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                paymentUrl: expect.any(String),
            })
        );

        // Check stock
        const newStock = (await Variant.findByPk("103")).stock;
        expect(newStock).toBe(stock - 5);

        // Notify
        const order = res.body.order;
        const resNotify = await request(app)
            .post("/api/v2/payment/stripe/notify")
            .send({
                data: {
                    object: {
                        payment_intent: order.orderID,
                    },
                },
            });

        expect(resNotify.status).toBe(StatusCodes.OK);
    });

    it("should return 200 and create awaiting payment order with Credit Card, also notify if failed", async () => {
        // Add new item to cart
        await request(app)
            .post("/api/v2/cart/103")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                quantity: 5,
            });

        // Get stock
        const stock = (await Variant.findByPk("103")).stock;

        // Create pending order
        await request(app)
            .post("/api/v2/cart")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                variantIDs: ["103"],
            });

        const res = await request(app)
            .post("/api/v2/orders/pending")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                payment: "credit_card",
                notify: true,
            });

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                paymentUrl: expect.any(String),
            })
        );

        // Check stock
        const newStock = (await Variant.findByPk("103")).stock;
        expect(newStock).toBe(stock - 5);

        // Notify
        const order = res.body.order;
        const resNotify = await request(app)
            .post("/api/v2/payment/stripe/notify")
            .send({
                data: {
                    object: {
                        payment_intent: order.orderID,
                    },
                },
            });

        expect(resNotify.status).toBe(StatusCodes.OK);

        // Check stock
        const newStock2 = (await Variant.findByPk("103")).stock;
        expect(newStock2).toBe(stock);
    });

    it("should return 409 if address not found", async () => {
        // Delete address
        await Address.destroy({
            where: {
                userID: "4",
            },
        });

        // Add new item to cart
        await request(app)
            .post("/api/v2/cart/102")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                quantity: 1,
            });

        // Create pending order
        await request(app)
            .post("/api/v2/cart")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                variantIDs: ["102"],
            });

        const res = await request(app)
            .post("/api/v2/orders/pending")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                payment: "COD",
            });

        expect(res.status).toBe(StatusCodes.CONFLICT);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: false,
            })
        );
    });

    it("should return 409 if variant is out of stock", async () => {
        // Add new item to cart
        await request(app)
            .post("/api/v2/cart/102")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                quantity: 1000,
            });

        // Create pending order
        await request(app)
            .post("/api/v2/cart")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                variantIDs: ["102"],
            });

        const res = await request(app)
            .post("/api/v2/orders/pending")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                payment: "COD",
            });

        expect(res.status).toBe(StatusCodes.CONFLICT);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: false,
            })
        );
    });

    it("should return 404 if pending order not found", async () => {
        const res = await request(app)
            .post("/api/v2/orders/pending")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                payment: "COD",
            });

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: false,
            })
        );
    });

    it("should return 401 if token not provided", async () => {
        const res = await request(app).post("/api/v2/orders/pending").send({
            payment: "COD",
        });

        assertTokenNotProvided(res);
    });

    it("should return 401 if token invalid", async () => {
        const res = await request(app)
            .post("/api/v2/orders/pending")
            .set("Authorization", `Bearer invalid`)
            .send({
                payment: "COD",
            });

        assertTokenInvalid(res);
    });
});
