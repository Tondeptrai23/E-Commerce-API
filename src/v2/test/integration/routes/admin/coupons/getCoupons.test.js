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
describe("GET /admin/coupons", () => {
    it("should get all coupons", async () => {
        const res = await request(app)
            .get("/api/v2/admin/coupons")
            .query({ size: 20 })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                currentPage: 1,
                totalPages: expect.any(Number),
                totalItems: expect.any(Number),
                coupons: expect.any(Array),
            })
        );

        const coupons = res.body.coupons;
        expect(coupons.length).toBeGreaterThanOrEqual(1);
        coupons.forEach((coupon) => {
            expect(coupon).toEqual(
                expect.objectContaining({
                    couponID: expect.any(String),
                    code: expect.any(String),
                    discountValue: expect.any(Number),
                    discountType: expect.any(String),
                    description: expect.toBeOneOf([expect.any(String), null]),
                    startDate: expect.toBeOneOf([null, expect.any(String)]),
                    endDate: expect.toBeOneOf([null, expect.any(String)]),
                    minimumOrderAmount: expect.any(Number),
                    maxUsage: expect.toBeOneOf([null, expect.any(Number)]),
                    timesUsed: expect.any(Number),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    categories: expect.any(Array),
                    products: expect.any(Array),
                })
            );
        });
    });

    it("should get all coupons with filtering", async () => {
        const res = await request(app)
            .get("/api/v2/admin/coupons")
            .query({ discountType: "percentage" })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                currentPage: 1,
                totalPages: expect.any(Number),
                totalItems: expect.any(Number),
                coupons: expect.any(Array),
            })
        );

        const coupons = res.body.coupons;
        expect(coupons.length).toBeGreaterThanOrEqual(1);
        coupons.forEach((coupon) => {
            expect(coupon.discountType).toBe("percentage");
        });
    });

    it("should get all coupons with filtering 2", async () => {
        const res = await request(app)
            .get("/api/v2/admin/coupons")
            .query({ discountValue: "[lte]20", discountType: "percentage" })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                currentPage: 1,
                totalPages: expect.any(Number),
                totalItems: expect.any(Number),
                coupons: expect.any(Array),
            })
        );

        const coupons = res.body.coupons;
        expect(coupons.length).toBeGreaterThanOrEqual(1);
        coupons.forEach((coupon) => {
            expect(coupon.discountValue).toBeLessThanOrEqual(20);
            expect(coupon.discountType).toBe("percentage");
        });
    });

    it("should get all coupons with filtering 3", async () => {
        const res = await request(app)
            .get("/api/v2/admin/coupons")
            .query({
                discountValue: "[gte]10",
                discountType: "fixed",
                target: "all",
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                currentPage: 1,
                totalPages: expect.any(Number),
                totalItems: expect.any(Number),
                coupons: expect.any(Array),
            })
        );

        const coupons = res.body.coupons;
        expect(coupons.length).toBeGreaterThanOrEqual(1);
        coupons.forEach((coupon) => {
            expect(coupon.discountValue).toBeGreaterThanOrEqual(10);
            expect(coupon.discountType).toBe("fixed");
            expect(coupon.target).toBe("all");
        });
    });

    it("should get all coupons with filtering 4", async () => {
        const res = await request(app)
            .get("/api/v2/admin/coupons")
            .query({
                product: {
                    name: "[like]T-shirt",
                },
                category: ["shorts"],
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                currentPage: 1,
                totalPages: expect.any(Number),
                totalItems: expect.any(Number),
                coupons: expect.any(Array),
            })
        );

        const coupons = res.body.coupons;
        expect(coupons.length).toBeGreaterThanOrEqual(1);
        coupons.forEach((coupon) => {
            const hasProduct = coupon.products.some((product) =>
                product.name.toLowerCase().includes("t-shirt")
            );
            const hasCategory = coupon.categories.some(
                (category) =>
                    category.toLowerCase().includes("shorts") ||
                    category.toLowerCase().includes("bottoms") ||
                    category.toLowerCase().includes("type")
            );
            expect(hasProduct || hasCategory).toBe(true);
        });
    });

    it("should get all coupons with sorting", async () => {
        const res = await request(app)
            .get("/api/v2/admin/coupons")
            .query({ sort: "-discountValue" })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                currentPage: 1,
                totalPages: expect.any(Number),
                totalItems: expect.any(Number),
                coupons: expect.any(Array),
            })
        );

        const coupons = res.body.coupons;
        expect(coupons.length).toBeGreaterThanOrEqual(1);
        let prevDiscountValue = Infinity;
        coupons.forEach((coupon) => {
            expect(coupon.discountValue).toBeLessThanOrEqual(prevDiscountValue);
            prevDiscountValue = coupon.discountValue;
        });
    });

    it("should get all coupons with sorting 2", async () => {
        const res = await request(app)
            .get("/api/v2/admin/coupons")
            .query({ sort: "discountValue,-maxUsage" })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                currentPage: 1,
                totalPages: expect.any(Number),
                totalItems: expect.any(Number),
                coupons: expect.any(Array),
            })
        );

        const coupons = res.body.coupons;
        expect(coupons.length).toBeGreaterThanOrEqual(1);
        let prevDiscountValue = -Infinity;
        let prevMaxUsage = Infinity;
        coupons.forEach((coupon) => {
            expect(coupon.discountValue).toBeGreaterThanOrEqual(
                prevDiscountValue
            );
            if (coupon.discountValue === prevDiscountValue) {
                expect(coupon.maxUsage).toBeLessThanOrEqual(prevMaxUsage);
            }
            prevDiscountValue = coupon.discountValue;
            prevMaxUsage = coupon.maxUsage;
        });
    });

    it("should get all coupons with pagination", async () => {
        const res = await request(app)
            .get("/api/v2/admin/coupons")
            .query({ size: 2, page: 1 })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                currentPage: 1,
                totalPages: expect.any(Number),
                totalItems: expect.any(Number),
                coupons: expect.any(Array),
            })
        );

        const coupons = res.body.coupons;
        expect(coupons.length).toBe(2);

        const res2 = await request(app)
            .get("/api/v2/admin/coupons")
            .query({ size: 2, page: 2 })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res2.status).toBe(StatusCodes.OK);
        expect(res2.body).toEqual(
            expect.objectContaining({
                success: true,
                currentPage: 2,
                totalPages: expect.any(Number),
                totalItems: expect.any(Number),
                coupons: expect.any(Array),
            })
        );

        const coupons2 = res2.body.coupons;
        expect(coupons2.length).toBeLessThanOrEqual(2);
    });

    it("should get all coupons with pagination 2", async () => {
        const res = await request(app)
            .get("/api/v2/admin/coupons")
            .query({ size: 2, page: 1, sort: "-discountValue" })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                currentPage: 1,
                totalPages: expect.any(Number),
                totalItems: expect.any(Number),
                coupons: expect.any(Array),
            })
        );

        const coupons = res.body.coupons;
        expect(coupons.length).toBe(2);

        const res2 = await request(app)
            .get("/api/v2/admin/coupons")
            .query({ size: 2, page: 2, sort: "-discountValue" })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res2.status).toBe(StatusCodes.OK);
        expect(res2.body).toEqual(
            expect.objectContaining({
                success: true,
                currentPage: 2,
                totalPages: expect.any(Number),
                totalItems: expect.any(Number),
                coupons: expect.any(Array),
            })
        );

        const coupons2 = res2.body.coupons;
        expect(coupons2.length).toBeLessThanOrEqual(2);

        let prevDiscountValue = Infinity;
        coupons.forEach((coupon) => {
            expect(coupon.discountValue).toBeLessThanOrEqual(prevDiscountValue);
            prevDiscountValue = coupon.discountValue;
        });

        coupons2.forEach((coupon) => {
            expect(coupon.discountValue).toBeLessThanOrEqual(prevDiscountValue);
            prevDiscountValue = coupon.discountValue;
        });
    });

    it("should get all coupons with pagination 3", async () => {
        const res = await request(app)
            .get("/api/v2/admin/coupons")
            .query({
                size: 2,
                page: 1,
                sort: "discountValue,-maxUsage",
                target: "all",
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                currentPage: 1,
                totalPages: expect.any(Number),
                totalItems: expect.any(Number),
                coupons: expect.any(Array),
            })
        );

        const coupons = res.body.coupons;
        expect(coupons.length).toBe(2);

        const res2 = await request(app)
            .get("/api/v2/admin/coupons")
            .query({
                size: 2,
                page: 2,
                sort: "discountValue,-maxUsage",
                target: "all",
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res2.status).toBe(StatusCodes.OK);
        expect(res2.body).toEqual(
            expect.objectContaining({
                success: true,
                currentPage: 2,
                totalPages: expect.any(Number),
                totalItems: expect.any(Number),
                coupons: expect.any(Array),
            })
        );

        const coupons2 = res2.body.coupons;
        expect(coupons2.length).toBeLessThanOrEqual(2);

        let prevDiscountValue = -Infinity;
        let prevMaxUsage = Infinity;
        coupons.forEach((coupon) => {
            expect(coupon.discountValue).toBeGreaterThanOrEqual(
                prevDiscountValue
            );
            if (coupon.discountValue === prevDiscountValue) {
                expect(coupon.maxUsage).toBeLessThanOrEqual(prevMaxUsage);
            }
            prevDiscountValue = coupon.discountValue;
            prevMaxUsage = coupon.maxUsage;
        });

        coupons2.forEach((coupon) => {
            expect(coupon.discountValue).toBeGreaterThanOrEqual(
                prevDiscountValue
            );
            if (coupon.discountValue === prevDiscountValue) {
                expect(coupon.maxUsage).toBeLessThanOrEqual(prevMaxUsage);
            }
            prevDiscountValue = coupon.discountValue;
            prevMaxUsage = coupon.maxUsage;
        });
    });

    it("should get all coupons with default", async () => {
        const res = await request(app)
            .get("/api/v2/admin/coupons")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                currentPage: 1,
                totalPages: expect.any(Number),
                totalItems: expect.any(Number),
                coupons: expect.any(Array),
            })
        );

        const coupons = res.body.coupons;
        expect(coupons.length).toBe(5);

        let prevCreatedAt = new Date().getTime();
        coupons.forEach((coupon) => {
            expect(new Date(coupon.createdAt).getTime()).toBeLessThanOrEqual(
                prevCreatedAt
            );
            prevCreatedAt = new Date(coupon.createdAt).getTime();
        });
    });

    it("should return 400 if query is invalid", async () => {
        const res = await request(app)
            .get("/api/v2/admin/coupons")
            .query({ size: "invalid" })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: false,
                errors: expect.any(Array),
            })
        );
    });

    it("should return 401 if access token is missing", async () => {
        const res = await request(app).get("/api/v2/admin/coupons");

        assertTokenNotProvided(res);
    });

    it("should return 401 if access token is invalid", async () => {
        const res = await request(app)
            .get("/api/v2/admin/coupons")
            .set("Authorization", `Bearer invalidtoken`);

        assertTokenInvalid(res);
    });

    it("should return 403 if user is not an admin", async () => {
        const res = await request(app)
            .get("/api/v2/admin/coupons")
            .set("Authorization", `Bearer ${accessTokenUser}`);

        assertNotAnAdmin(res);
    });
});
