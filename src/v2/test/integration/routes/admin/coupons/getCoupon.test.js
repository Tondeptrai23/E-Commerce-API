import request from "supertest";
import { StatusCodes } from "http-status-codes";
import app from "../../../../../app.js";
import seedData from "../../../../../seedData.js";
import {
    assertNotAnAdmin,
    assertTokenInvalid,
    assertTokenNotProvided,
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
describe("GET /admin/coupons/:couponID", () => {
    it("should get a coupon", async () => {
        const res = await request(app)
            .get("/api/v2/admin/coupons/1")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                coupon: expect.objectContaining({
                    couponID: "1",
                    code: expect.any(String),
                    discountType: expect.any(String),
                    discountValue: expect.any(Number),
                    startDate: expect.toBeOneOf([expect.any(String), null]),
                    endDate: expect.toBeOneOf([expect.any(String), null]),
                    target: expect.any(String),
                    timesUsed: expect.any(Number),
                    maxUsage: expect.toBeOneOf([expect.any(Number), null]),
                    minimumOrderAmount: expect.any(Number),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                }),
            })
        );
    });

    it("should return 404 if coupon not found", async () => {
        const res = await request(app)
            .get("/api/v2/admin/coupons/999")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body.success).toBe(false);
    });

    it("should return 401 if token is not provided", async () => {
        const res = await request(app).get("/api/v2/admin/coupons/1");

        assertTokenNotProvided(res);
    });

    it("should return 401 if token is invalid", async () => {
        const res = await request(app)
            .get("/api/v2/admin/coupons/1")
            .set("Authorization", `Bearer INVALID`);

        assertTokenInvalid(res);
    });

    it("should return 403 if not an admin", async () => {
        const res = await request(app)
            .get("/api/v2/admin/coupons/1")
            .set("Authorization", `Bearer ${accessTokenUser}`);

        assertNotAnAdmin(res);
    });
});
