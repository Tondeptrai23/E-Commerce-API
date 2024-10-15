import request from "supertest";
import { StatusCodes } from "http-status-codes";
import app from "../../../../../app.js";
import seedData from "../../../../../seedData.js";
import {
    assertTokenNotProvided,
    assertTokenInvalid,
} from "../../utils.integration.js";
import { db } from "../../../../../models/index.model.js";

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

afterAll(async () => {
    await db.close();
    accessToken = null;
    accessTokenUser = null;
});

/**
 * Tests
 */
describe("GET /api/v2/orders/pending/coupons/recommended", () => {
    let order;
    beforeAll(async () => {
        order = (
            await request(app)
                .get("/api/v2/orders/pending")
                .set("Authorization", `Bearer ${accessTokenUser}`)
        ).body.order;
    });

    it("should return recommended coupons", async () => {
        const res = await request(app)
            .get("/api/v2/orders/pending/coupons/recommended")
            .set("Authorization", `Bearer ${accessTokenUser}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            coupons: expect.any(Array),
        });

        for (const coupon of res.body.coupons) {
            expect(coupon).toEqual({
                code: expect.any(String),
                subTotal: expect.any(Number),
                finalTotal: expect.any(Number),
            });
            expect(coupon.finalTotal).toBeLessThan(coupon.subTotal);
        }
    });

    it("should return 404 if pending order not found", async () => {
        const res = await request(app)
            .get("/api/v2/orders/pending/coupons/recommended")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body).toEqual(expect.objectContaining({ success: false }));
    });

    it("should return 401 if token not provided", async () => {
        const res = await request(app).get(
            "/api/v2/orders/pending/coupons/recommended"
        );

        assertTokenNotProvided(res);
    });

    it("should return 401 if token invalid", async () => {
        const res = await request(app)
            .get("/api/v2/orders/pending/coupons/recommended")
            .set("Authorization", `Bearer invalid`);

        assertTokenInvalid(res);
    });
});
