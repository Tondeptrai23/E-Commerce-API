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
describe("POST /api/v2/cart", () => {
    it("should fetch the cart into new order", async () => {
        await request(app)
            .post("/api/v2/cart/102")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                quantity: 3,
            });

        const res = await request(app)
            .post("/api/v2/cart")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                variantIDs: ["102"],
            });

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            order: expect.any(Object),
        });

        expect(res.body.order).toEqual(
            expect.objectContaining({
                orderID: expect.any(String),
                userID: "4",
                couponID: null,
                shippingAddressID: expect.toBeOneOf([null, expect.any(String)]),
                message: null,
                orderDate: null,
                paymentMethod: "COD",
                subTotal: expect.any(Number),
                finalTotal: expect.any(Number),
                status: "pending",
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                orderItems: expect.any(Array),
            })
        );

        expect(res.body.order.subTotal).toBeGreaterThan(0);
        for (const item of res.body.order.orderItems) {
            expect(item.variantID).toBe("102");
            expect(item.quantity).toBe(3);
            expect(item.price).toBeGreaterThan(0);
        }
    });

    it("should fetch the cart into the new order (replace existing order)", async () => {
        const res = await request(app)
            .post("/api/v2/cart")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                variantIDs: ["102"],
            });

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            order: expect.any(Object),
        });
        expect(res.body.order).toEqual(
            expect.objectContaining({
                orderID: expect.any(String),
                userID: "1",
                couponID: expect.any(String),
                shippingAddressID: expect.any(String),
                message: null,
                paymentMethod: "COD",
                subTotal: expect.any(Number),
                finalTotal: expect.any(Number),
                status: "pending",
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                orderItems: expect.any(Array),
            })
        );

        expect(res.body.order.subTotal).toBeGreaterThan(0);
        for (const item of res.body.order.orderItems) {
            expect(item.variantID).toBe("102");
            expect(item.quantity).toBe(2);
            expect(item.price).toBeGreaterThan(0);
        }
    });

    it("should return 401 if token not provided", async () => {
        const res = await request(app)
            .post("/api/v2/cart")
            .send({
                variantIDs: ["1"],
            });

        assertTokenNotProvided(res);
    });

    it("should return 401 if token invalid", async () => {
        const res = await request(app)
            .post("/api/v2/cart")
            .set("Authorization", `Bearer invalid`)
            .send({
                variantIDs: ["1"],
            });

        assertTokenInvalid(res);
    });
});
