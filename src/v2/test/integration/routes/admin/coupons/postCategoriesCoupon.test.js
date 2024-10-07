import request from "supertest";
import { StatusCodes } from "http-status-codes";
import app from "../../../../../app.js";
import seedData from "../../../../../seedData.js";
import {
    assertNotAnAdmin,
    assertTokenInvalid,
    assertTokenNotProvided,
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
describe("POST /admin/coupons/:couponID/categories", () => {
    it("should add categories to a coupon", async () => {
        const res = await request(app)
            .post("/api/v2/admin/coupons/1/categories")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                categories: ["tops", "male"],
            });

        expect(res.status).toBe(StatusCodes.CREATED);
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
                    categories: expect.arrayContaining(["tops", "male"]),
                }),
            })
        );
    });

    it("should return 400 if categories are missing", async () => {
        const res = await request(app)
            .post("/api/v2/admin/coupons/1/categories")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({});

        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: false,
            })
        );
    });

    it("should return 404 if coupon not found", async () => {
        const res = await request(app)
            .post("/api/v2/admin/coupons/999/categories")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                categories: ["tops"],
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
            .post("/api/v2/admin/coupons/1/categories")
            .send({
                categories: ["tops"],
            });

        assertTokenNotProvided(res);
    });

    it("should return 401 if token is invalid", async () => {
        const res = await request(app)
            .post("/api/v2/admin/coupons/1/categories")
            .set("Authorization", "Bearer INVALID")
            .send({
                categories: ["tops"],
            });

        assertTokenInvalid(res);
    });

    it("should return 403 if not an admin", async () => {
        const res = await request(app)
            .post("/api/v2/admin/coupons/1/categories")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                categories: ["tops"],
            });

        assertNotAnAdmin(res);
    });
});
