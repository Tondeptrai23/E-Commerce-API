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
describe("PATCH /admin/coupons/:couponID", () => {
    it("should update a coupon", async () => {
        const res = await request(app)
            .patch("/api/v2/admin/coupons/1")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                description: "Updated description",
                endDate: "2024-12-31",
                maxUsage: 100,
                minimumOrderAmount: 100,
            });

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                coupon: expect.objectContaining({
                    couponID: "1",
                    code: expect.any(String),
                    discountType: expect.any(String),
                    discountValue: expect.any(Number),
                    description: "Updated description",
                    startDate: expect.any(String),
                    endDate: "2024-12-31",
                    timesUsed: expect.any(Number),
                    maxUsage: 100,
                    minimumOrderAmount: 100,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                }),
            })
        );
    });

    it("should update a coupon 2", async () => {
        const res = await request(app)
            .patch("/api/v2/admin/coupons/1")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                description: "Updated description 2",
            });

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                coupon: expect.objectContaining({
                    couponID: "1",
                    code: expect.any(String),
                    discountType: expect.any(String),
                    discountValue: expect.any(Number),
                    description: "Updated description 2",
                    startDate: expect.toBeOneOf([expect.any(String), null]),
                    endDate: expect.toBeOneOf([expect.any(String), null]),
                    maxUsage: expect.toBeOneOf([expect.any(Number), null]),
                    minimumOrderAmount: expect.any(Number),
                    timesUsed: expect.any(Number),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                }),
            })
        );
    });

    it("should return 400 if invalid data", async () => {
        const res = await request(app)
            .patch("/api/v2/admin/coupons/1")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                description: "Updated description",
                endDate: "2024-12-31",
                maxUsage: "invalid",
                minimumOrderAmount: 100,
            });

        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: false,
            })
        );
    });

    it("should return 400 if startDate is after endDate", async () => {
        const res = await request(app)
            .patch("/api/v2/admin/coupons/1")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                description: "Updated description",
                endDate: "2020-12-31",
                maxUsage: 100,
                minimumOrderAmount: 100,
            });

        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: false,
            })
        );
    });

    it("should return 404 if coupon not found", async () => {
        const res = await request(app)
            .patch("/api/v2/admin/coupons/999")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                description: "Updated description",
                endDate: "2024-12-31",
                maxUsage: 100,
                minimumOrderAmount: 100,
            });

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
    });

    it("should return 403 if not an admin", async () => {
        const res = await request(app)
            .patch("/api/v2/admin/coupons/1")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                description: "Updated description",
                endDate: "2024-12-31",
                maxUsage: 100,
                minimumOrderAmount: 100,
            });

        assertNotAnAdmin(res);
    });

    it("should return 401 if token is invalid", async () => {
        const res = await request(app)
            .patch("/api/v2/admin/coupons/1")
            .set("Authorization", `Bearer INVALID`)
            .send({
                description: "Updated description",
                endDate: "2024-12-31",
                maxUsage: 100,
                minimumOrderAmount: 100,
            });

        assertTokenInvalid(res);
    });

    it("should return 401 if token is not provided", async () => {
        const res = await request(app).patch("/api/v2/admin/coupons/1").send({
            description: "Updated description",
            endDate: "2024-12-31",
            maxUsage: 100,
            minimumOrderAmount: 100,
        });

        assertTokenNotProvided(res);
    });
});
