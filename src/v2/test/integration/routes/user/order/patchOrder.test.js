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
describe("PATCH /api/v2/orders/pending", () => {
    let order;
    beforeAll(async () => {
        const res = await request(app)
            .get("/api/v2/orders/pending")
            .set("Authorization", `Bearer ${accessTokenUser}`);

        order = res.body.order;
    });

    it("should update an order", async () => {
        const res = await request(app)
            .patch("/api/v2/orders/pending")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                addressID: "102",
            });

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            order: expect.objectContaining({
                orderID: order.orderID,
                shippingAddressID: "102",
            }),
        });

        // Check if order is updated
        const res2 = await request(app)
            .get("/api/v2/orders/pending")
            .set("Authorization", `Bearer ${accessTokenUser}`);

        expect(res2.status).toBe(StatusCodes.OK);
        expect(res2.body).toEqual({
            success: true,
            order: expect.objectContaining({
                orderID: order.orderID,
                shippingAddressID: "102",
            }),
        });
        order = res2.body.order;
    });

    it("should update an order 2", async () => {
        const res = await request(app)
            .patch("/api/v2/orders/pending")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                message: "Hello",
            });

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            order: expect.objectContaining({
                orderID: order.orderID,
                message: "Hello",
            }),
        });

        // Check if order is updated
        const res2 = await request(app)
            .get("/api/v2/orders/pending")
            .set("Authorization", `Bearer ${accessTokenUser}`);

        expect(res2.status).toBe(StatusCodes.OK);
        expect(res2.body).toEqual({
            success: true,
            order: expect.objectContaining({
                orderID: order.orderID,
                message: "Hello",
            }),
        });

        order = res2.body.order;
    });

    it("should update an order 3", async () => {
        const res = await request(app)
            .patch("/api/v2/orders/pending")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                message: null,
                addressID: "101",
            });

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            order: expect.objectContaining({
                orderID: order.orderID,
                message: null,
                shippingAddressID: "101",
            }),
        });

        // Check if order is updated
        const res2 = await request(app)
            .get("/api/v2/orders/pending")
            .set("Authorization", `Bearer ${accessTokenUser}`);

        expect(res2.status).toBe(StatusCodes.OK);
        expect(res2.body).toEqual({
            success: true,
            order: expect.objectContaining({
                orderID: order.orderID,
                message: null,
                shippingAddressID: "101",
            }),
        });

        order = res2.body.order;
    });

    it("should return 404 if order not found", async () => {
        const res = await request(app)
            .patch("/api/v2/orders/pending")
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

    it("should return 404 if address not found", async () => {
        const res = await request(app)
            .patch("/api/v2/orders/pending")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                addressID: "999",
            });

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body).toEqual({
            success: false,
            errors: [
                {
                    error: "NotFound",
                    message: "Address not found",
                },
            ],
        });
    });

    it("should return 400 if message is not a string", async () => {
        const res = await request(app)
            .patch("/api/v2/orders/pending")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                message: 123,
            });

        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body).toEqual({
            success: false,
            errors: [
                expect.objectContaining({
                    message: "Message should be a string",
                }),
            ],
        });
    });

    it("should return 401 if token not provided", async () => {
        const res = await request(app).patch("/api/v2/orders/pending");

        assertTokenNotProvided(res);
    });

    it("should return 401 if token invalid", async () => {
        const res = await request(app)
            .patch("/api/v2/orders/pending")
            .set("Authorization", `Bearer invalid`);

        assertTokenInvalid(res);
    });
});
