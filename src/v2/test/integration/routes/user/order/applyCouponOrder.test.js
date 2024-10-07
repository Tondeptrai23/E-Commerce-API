import request from "supertest";
import { StatusCodes } from "http-status-codes";
import app from "../../../../../app.js";
import seedData from "../../../../../seedData.js";
import {
    assertTokenNotProvided,
    assertTokenInvalid,
} from "../../utils.integration.js";
import couponService from "../../../../../services/shopping/coupon.service.js";

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
describe("POST /api/v2/orders/pending/coupons", () => {
    let pendingOrder;
    beforeAll(async () => {
        await request(app)
            .delete("/api/v2/cart")
            .set("Authorization", `Bearer ${accessTokenUser}`);

        await request(app)
            .post("/api/v2/cart/102")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                quantity: 10,
            });

        const res = await request(app)
            .post("/api/v2/cart")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                variantIDs: ["102"],
            });

        pendingOrder = res.body.order;
    });

    it("should return 200 if coupon is applied successfully", async () => {
        const res = await request(app)
            .post("/api/v2/orders/pending/coupons")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                code: "5OFF_TOPS",
            });

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            order: expect.objectContaining({
                orderID: pendingOrder.orderID,
                coupon: "5OFF_TOPS",
            }),
        });

        expect(res.body.order.finalTotal).toBeLessThan(pendingOrder.finalTotal);
    });

    it("should return 400 if coupon is invalid", async () => {
        const res = await request(app)
            .post("/api/v2/orders/pending/coupons")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                code: 123,
            });

        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: false,
            })
        );
    });

    it("should return 404 if coupon is not found", async () => {
        const res = await request(app)
            .post("/api/v2/orders/pending/coupons")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                code: "invalid",
            });

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: false,
            })
        );
    });

    it("should return 404 if coupon is not available", async () => {
        const res = await request(app)
            .post("/api/v2/orders/pending/coupons")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                code: "FLASHSALE",
            });

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: false,
            })
        );
    });

    it("should return 404 if order is not found", async () => {
        const res = await request(app)
            .post("/api/v2/orders/pending/coupons")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                code: "5OFF_TOPS",
            });

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: false,
            })
        );
    });

    it("should return 401 if token is not provided", async () => {
        const res = await request(app)
            .post("/api/v2/orders/pending/coupons")
            .send({
                code: "10OFF",
            });

        assertTokenNotProvided(res);
    });

    it("should return 401 if token is invalid", async () => {
        const res = await request(app)
            .post("/api/v2/orders/pending/coupons")
            .set("Authorization", `Bearer invalid`)
            .send({
                code: "10OFF",
            });

        assertTokenInvalid(res);
    });
});
