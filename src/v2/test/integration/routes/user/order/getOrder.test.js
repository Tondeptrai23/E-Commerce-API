import request from "supertest";
import { StatusCodes } from "http-status-codes";
import app from "../../../../../app.js";
import seedData from "../../../../../seedData.js";
import {
    assertTokenNotProvided,
    assertTokenInvalid,
} from "../../utils.integration.js";

/**
 * Set up
 */
let accessToken = "";
let accessTokenUser = "";
beforeAll(async () => {
    // Seed data
    await seedData();

    // Get access token
    const res = await request(app).post("/api/v2/auth/signin").send({
        email: "admin@gmail.com",
        password: "adminpassword",
    });
    accessToken = res.body.accessToken;

    const resUser = await request(app).post("/api/v2/auth/signin").send({
        email: "user1@gmail.com",
        password: "password1",
    });
    accessTokenUser = resUser.body.accessToken;
});

/**
 * Tests
 */
describe("GET /api/v2/orders/:orderID", () => {
    it("should get an order", async () => {
        const res = await request(app)
            .get("/api/v2/orders/1")
            .set("Authorization", `Bearer ${accessTokenUser}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            order: expect.any(Object),
        });
        expect(res.body.order).toEqual({
            orderID: "1",
            status: expect.toBeOneOf([
                "pending",
                "processing",
                "shipped",
                "delivered",
            ]),
            orderDate: expect.toBeOneOf([expect.any(String), null]),
            message: expect.toBeOneOf([expect.any(String), null]),
            subTotal: expect.any(Number),
            finalTotal: expect.any(Number),
            paymentMethod: expect.any(String),
            userID: expect.any(String),
            orderItems: expect.any(Array),
            coupon: expect.any(String),
            couponID: expect.any(String),
            shippingAddress: expect.any(Object),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
        for (const orderItem of res.body.order.orderItems) {
            expect(orderItem).toEqual({
                orderItemID: expect.any(String),
                productID: expect.any(String),
                variantID: expect.any(String),
                name: expect.any(String),
                price: expect.any(Number),
                discountPrice: expect.toBeOneOf([expect.any(Number), null]),
                quantity: expect.any(Number),
                image: expect.toBeOneOf([expect.any(String), null]),
                totalPrice: expect.any(Number),
            });
        }
        expect(res.body.order.shippingAddress).toEqual({
            recipientName: expect.any(String),
            phoneNumber: expect.any(String),
            address: expect.any(String),
            city: expect.any(String),
            district: expect.any(String),
        });
    });

    it("should return 404 if order not found", async () => {
        const res = await request(app)
            .get("/api/v2/orders/999")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body).toEqual({
            success: false,
            errors: [
                {
                    error: "NotFound",
                    message: "Order not found",
                },
            ],
        });
    });

    it("should return 401 if token not provided", async () => {
        const res = await request(app).get("/api/v2/orders/1");

        assertTokenNotProvided(res);
    });

    it("should return 401 if token invalid", async () => {
        const res = await request(app)
            .get("/api/v2/orders/1")
            .set("Authorization", `Bearer invalid`);

        assertTokenInvalid(res);
    });
});
