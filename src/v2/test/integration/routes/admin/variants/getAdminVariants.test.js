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
describe("GET /admin/variants", () => {
    it("should return a list of variants", async () => {
        const res = await request(app)
            .get("/api/v2/admin/variants")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.statusCode).toEqual(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                variants: expect.any(Array),
            })
        );

        expect(res.body.variants[0]).toEqual(
            expect.objectContaining({
                variantID: expect.any(String),
                productID: expect.any(String),
                name: expect.any(String),
                price: expect.any(Number),
                stock: expect.any(Number),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            })
        );
    });

    it("should return a list of variants even if they are deleted", async () => {
        const res = await request(app)
            .get("/api/v2/admin/variants")
            .set("Authorization", `Bearer ${accessToken}`)
            .query({ size: 20 });

        expect(res.statusCode).toEqual(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                variants: expect.any(Array),
            })
        );

        expect(res.body.variants[0]).toEqual(
            expect.objectContaining({
                variantID: expect.any(String),
                productID: expect.any(String),
                name: expect.any(String),
                price: expect.any(Number),
                stock: expect.any(Number),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            })
        );

        expect(res.body.variants.some((v) => v.deletedAt)).toEqual(true);
    });

    it("should return a list of variants with filtering", async () => {
        const res = await request(app)
            .get("/api/v2/admin/variants")
            .query({ name: "[like]T-shirt" })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.statusCode).toEqual(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                variants: expect.any(Array),
            })
        );

        expect(res.body.variants).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    variantID: expect.any(String),
                    productID: expect.any(String),
                    name: expect.any(String),
                    price: expect.any(Number),
                    stock: expect.any(Number),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                }),
            ])
        );

        for (const variant of res.body.variants) {
            expect(variant.name).toEqual(expect.stringMatching(/T-shirt/i));
        }
    });

    it("should return a list of variants with filtering 2", async () => {
        const res = await request(app)
            .get("/api/v2/admin/variants")
            .query({ price: "[lte]40", stock: "[gte]10" })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.statusCode).toEqual(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                variants: expect.any(Array),
            })
        );

        expect(res.body.variants).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    variantID: expect.any(String),
                    productID: expect.any(String),
                    name: expect.any(String),
                    price: expect.any(Number),
                    stock: expect.any(Number),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                }),
            ])
        );

        for (const variant of res.body.variants) {
            expect(variant.price).toBeLessThanOrEqual(40);
            expect(variant.stock).toBeGreaterThanOrEqual(10);
        }
    });

    it("should return a list of variants with filtering 3", async () => {
        const res = await request(app)
            .get("/api/v2/admin/variants")
            .query({
                attributes: {
                    color: "red",
                    size: ["M", "L"],
                },
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.statusCode).toEqual(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                variants: expect.any(Array),
            })
        );

        expect(res.body.variants).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    variantID: expect.any(String),
                    productID: expect.any(String),
                    name: expect.any(String),
                    price: expect.any(Number),
                    stock: expect.any(Number),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                }),
            ])
        );

        for (const variant of res.body.variants) {
            expect(variant.attributes.color).toEqual("red");
            expect(variant.attributes.size).toEqual(
                expect.stringMatching(/M|L/)
            );
        }
    });

    it("should return a list of variants with filtering 4", async () => {
        const res = await request(app)
            .get("/api/v2/admin/variants")
            .query({
                price: "[gte]30",
                attributes: {
                    color: ["red", "white"],
                },
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.statusCode).toEqual(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                variants: expect.any(Array),
            })
        );

        expect(res.body.variants).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    variantID: expect.any(String),
                    productID: expect.any(String),
                    name: expect.any(String),
                    price: expect.any(Number),
                    stock: expect.any(Number),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                }),
            ])
        );

        for (const variant of res.body.variants) {
            expect(variant.price).toBeGreaterThanOrEqual(30);
            expect(variant.attributes.color).toEqual(
                expect.stringMatching(/red|white/)
            );
        }
    });

    it("should return a list of variants with sorting", async () => {
        const res = await request(app)
            .get("/api/v2/admin/variants")
            .query({ sort: "price" })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.statusCode).toEqual(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                variants: expect.any(Array),
            })
        );

        let prevPrice = 0;
        for (const variant of res.body.variants) {
            expect(variant.price).toBeGreaterThanOrEqual(prevPrice);
            prevPrice = variant.price;
        }
    });

    it("should return a list of variants with sorting 2", async () => {
        const res = await request(app)
            .get("/api/v2/admin/variants")
            .query({ sort: "-price,stock" })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.statusCode).toEqual(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                variants: expect.any(Array),
            })
        );

        let prevPrice = Infinity;
        for (const variant of res.body.variants) {
            expect(variant.price).toBeLessThanOrEqual(prevPrice);

            prevPrice = variant.price;
        }
    });

    it("should return a list of variants with pagination", async () => {
        const res = await request(app)
            .get("/api/v2/admin/variants")
            .query({ page: 1, size: 2 })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.statusCode).toEqual(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                currentPage: 1,
                totalPages: expect.any(Number),
                totalItems: expect.any(Number),
                variants: expect.any(Array),
            })
        );

        const res2 = await request(app)
            .get("/api/v2/admin/variants")
            .query({ page: 2, size: 2 })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res2.statusCode).toEqual(StatusCodes.OK);
        expect(res2.body).toEqual(
            expect.objectContaining({
                success: true,
                currentPage: 2,
                totalPages: expect.any(Number),
                totalItems: expect.any(Number),
                variants: expect.any(Array),
            })
        );
    });

    it("should return a list of variants with pagination 2", async () => {
        const res = await request(app)
            .get("/api/v2/admin/variants")
            .query({ page: 1, size: 2, sort: "-price" })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.statusCode).toEqual(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                currentPage: 1,
                totalPages: expect.any(Number),
                totalItems: expect.any(Number),
                variants: expect.any(Array),
            })
        );

        const res2 = await request(app)
            .get("/api/v2/admin/variants")
            .query({ page: 2, size: 2, sort: "-price" })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res2.statusCode).toEqual(StatusCodes.OK);
        expect(res2.body).toEqual(
            expect.objectContaining({
                success: true,
                currentPage: 2,
                totalPages: expect.any(Number),
                totalItems: expect.any(Number),
                variants: expect.any(Array),
            })
        );

        let prevPrice = Infinity;
        for (const variant of res.body.variants) {
            expect(variant.price).toBeLessThanOrEqual(prevPrice);
            prevPrice = variant.price;
        }

        for (const variant of res2.body.variants) {
            expect(variant.price).toBeLessThanOrEqual(prevPrice);
            prevPrice = variant.price;
        }
    });

    it("should return a list of variants default", async () => {
        const res = await request(app)
            .get("/api/v2/admin/variants")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.statusCode).toEqual(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                currentPage: 1,
                totalPages: expect.any(Number),
                totalItems: expect.any(Number),
                variants: expect.any(Array),
            })
        );

        expect(res.body.variants).toHaveLength(5);
        let prevDate = new Date(res.body.variants[0].createdAt).getTime();
        for (let i = 1; i < res.body.variants.length; i++) {
            expect(
                new Date(res.body.variants[i].createdAt).getTime()
            ).toBeLessThanOrEqual(prevDate);
            prevDate = new Date(res.body.variants[i].createdAt).getTime();
        }
    });

    it("should return an error if token is not provided", async () => {
        const res = await request(app).get("/api/v2/admin/variants");

        assertTokenNotProvided(res);
    });

    it("should return an error if token is invalid", async () => {
        const res = await request(app)
            .get("/api/v2/admin/variants")
            .set("Authorization", `Bearer 123`);

        assertTokenInvalid(res);
    });

    it("should return an error if user is not an admin", async () => {
        const res = await request(app)
            .get("/api/v2/admin/variants")
            .set("Authorization", `Bearer ${accessTokenUser}`);

        assertNotAnAdmin(res);
    });
});
