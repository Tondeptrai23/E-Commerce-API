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
describe("POST /admin/coupons", () => {
    it("should add a coupon", async () => {
        const res = await request(app)
            .post("/api/v2/admin/coupons")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                code: "NEWCODE",
                discountType: "percentage",
                discountValue: 10,
                description: "New coupon",
                target: "all",
                startDate: "2024-01-01",
                endDate: "2024-12-31",
                maxUsage: 100,
                minimumOrderAmount: 100,
            });

        expect(res.status).toBe(StatusCodes.CREATED);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                coupon: expect.objectContaining({
                    couponID: expect.any(String),
                    code: "NEWCODE",
                    discountType: "percentage",
                    discountValue: 10,
                    description: "New coupon",
                    target: "all",
                    startDate: "2024-01-01",
                    endDate: "2024-12-31",
                    timesUsed: 0,
                    maxUsage: 100,
                    minimumOrderAmount: 100,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                }),
            })
        );
    });

    it("should add a coupon 2", async () => {
        const res = await request(app)
            .post("/api/v2/admin/coupons")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                code: "NEWCODE2",
                discountType: "percentage",
                discountValue: 10,
                target: "all",
            });

        expect(res.status).toBe(StatusCodes.CREATED);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                coupon: expect.objectContaining({
                    couponID: expect.any(String),
                    code: "NEWCODE2",
                    discountType: "percentage",
                    discountValue: 10,
                    target: "all",
                    description: null,
                    startDate: null,
                    endDate: null,
                    timesUsed: 0,
                    maxUsage: null,
                    minimumOrderAmount: 0,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                }),
            })
        );
    });

    it("should add a coupon 3", async () => {
        const res = await request(app)
            .post("/api/v2/admin/coupons")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                code: "NEWCODE3",
                discountType: "percentage",
                discountValue: 10,
                target: "all",
                products: ["1", "3", "5"],
                categories: ["shorts", "tshirt"],
            });

        expect(res.status).toBe(StatusCodes.CREATED);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                coupon: expect.objectContaining({
                    couponID: expect.any(String),
                    code: "NEWCODE3",
                    discountType: "percentage",
                    discountValue: 10,
                    target: "all",
                    description: null,
                    startDate: null,
                    endDate: null,
                    maxUsage: null,
                    timesUsed: 0,
                    products: expect.arrayContaining([
                        expect.objectContaining({
                            productID: "1",
                            name: expect.any(String),
                        }),
                        expect.objectContaining({
                            productID: "3",
                            name: expect.any(String),
                        }),
                        expect.objectContaining({
                            productID: "5",
                            name: expect.any(String),
                        }),
                    ]),
                    categories: expect.arrayContaining(["shorts", "tshirt"]),
                    minimumOrderAmount: 0,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                }),
            })
        );
    });

    it("should add a coupon 4", async () => {
        const res = await request(app)
            .post("/api/v2/admin/coupons")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                code: "NEWCODE4",
                discountType: "percentage",
                discountValue: 10,
                target: "all",
                products: ["1", "3", "5", "7"],
                categories: ["bottoms", "tshirt", "shoes"],
            });

        expect(res.status).toBe(StatusCodes.CREATED);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                coupon: expect.objectContaining({
                    couponID: expect.any(String),
                    code: "NEWCODE4",
                    discountType: "percentage",
                    discountValue: 10,
                    target: "all",
                    minimumOrderAmount: 0,
                    timesUsed: 0,
                    products: expect.arrayContaining([
                        expect.objectContaining({
                            productID: "1",
                            name: expect.any(String),
                        }),
                        expect.objectContaining({
                            productID: "3",
                            name: expect.any(String),
                        }),
                        expect.objectContaining({
                            productID: "5",
                            name: expect.any(String),
                        }),
                    ]),
                    categories: expect.arrayContaining(["bottoms", "tshirt"]),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                }),
            })
        );
    });

    it("should return 400 if code is missing", async () => {
        const res = await request(app)
            .post("/api/v2/admin/coupons")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                discountType: "percentage",
                discountValue: 10,
                target: "all",
            });

        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: false,
            })
        );
    });

    it("should return 409 if code already exists", async () => {
        const res = await request(app)
            .post("/api/v2/admin/coupons")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                code: "10OFF",
                discountType: "percentage",
                discountValue: 10,
                target: "all",
            });

        expect(res.status).toBe(StatusCodes.CONFLICT);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: false,
            })
        );
    });

    it("should return 401 if token is not provided", async () => {
        const res = await request(app).post("/api/v2/admin/coupons").send({
            code: "NEWCODE",
            discountType: "percentage",
            discountValue: 10,
            target: "all",
            description: "New coupon",
        });

        assertTokenNotProvided(res);
    });

    it("should return 401 if token is invalid", async () => {
        const res = await request(app)
            .post("/api/v2/admin/coupons")
            .set("Authorization", "Bearer invalid")
            .send({
                code: "NEWCODE",
                discountType: "percentage",
                discountValue: 10,
                target: "all",
            });

        assertTokenInvalid(res);
    });

    it("should return 403 if not an admin", async () => {
        const res = await request(app)
            .post("/api/v2/admin/coupons")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                code: "NEWCODE",
                discountType: "percentage",
                discountValue: 10,
                target: "all",
            });

        assertNotAnAdmin(res);
    });
});
