import request from "supertest";
import { StatusCodes } from "http-status-codes";
import app from "../../../../../../app.js";
import variantService from "../../../../../../services/products/variant.service.js";
import VariantSerializer from "../../../../../../services/serializers/variant.serializer.service.js";
import seedData from "../../../../../../seedData.js";
import {
    assertNotAnAdmin,
    assertTokenInvalid,
    assertTokenNotProvided,
} from "../../../utils.integration.js";

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
describe("GET /admin/products", () => {
    it("should return a list of products", async () => {
        const res = await request(app)
            .get("/api/v2/admin/products")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.statusCode).toEqual(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                totalPages: expect.any(Number),
                currentPage: expect.any(Number),
                totalItems: expect.any(Number),
                products: expect.any(Array),
            })
        );

        expect(res.body.products.length).toBeGreaterThan(0);
        expect(res.body.products[0]).toEqual(
            expect.objectContaining({
                productID: expect.any(String),
                name: expect.any(String),
                description: expect.any(String),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                variants: expect.any(Array),
                categories: expect.any(Array),
            })
        );

        expect(res.body.products[0].variants[0]).toEqual(
            expect.objectContaining({
                variantID: expect.any(String),
                name: expect.any(String),
                price: expect.any(Number),
                stock: expect.any(Number),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            })
        );
    });

    it("should return a list of products with deleted products", async () => {
        const res = await request(app)
            .get("/api/v2/admin/products")
            .query({ size: 100 })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.statusCode).toEqual(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                totalPages: expect.any(Number),
                currentPage: expect.any(Number),
                totalItems: expect.any(Number),
                products: expect.any(Array),
            })
        );
        expect(res.body.products.some((product) => product.deletedAt)).toBe(
            true
        );
    });

    it("should return a list of products with filter 1", async () => {
        const res = await request(app)
            .get("/api/v2/admin/products")
            .query({ name: "[like]T-Shirt" })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.statusCode).toEqual(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                totalPages: expect.any(Number),
                currentPage: expect.any(Number),
                totalItems: expect.any(Number),
                products: expect.any(Array),
            })
        );

        expect(res.body.products.length).toBeGreaterThan(0);
        for (const product of res.body.products) {
            expect(product.name).toEqual(expect.stringMatching(/T-Shirt/i));
        }
    });

    it("should return a list of products with filter 2", async () => {
        const res = await request(app)
            .get("/api/v2/admin/products")
            .query({ variant: { price: "[gte]40", stock: "[gte]10" } })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.statusCode).toEqual(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                totalPages: expect.any(Number),
                currentPage: expect.any(Number),
                totalItems: expect.any(Number),
                products: expect.any(Array),
            })
        );

        expect(res.body.products.length).toBeGreaterThan(0);
        for (const product of res.body.products) {
            expect(product.variants[0].price).toBeGreaterThanOrEqual(40);
            expect(product.variants[0].stock).toBeGreaterThanOrEqual(10);
        }
    });

    it("should return a list of products with filter 3", async () => {
        const res = await request(app)
            .get("/api/v2/admin/products")
            .query({ category: ["bottoms", "tshirt"] })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.statusCode).toEqual(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                totalPages: expect.any(Number),
                currentPage: expect.any(Number),
                totalItems: expect.any(Number),
                products: expect.any(Array),
            })
        );

        expect(res.body.products.length).toBeGreaterThan(0);
        for (const product of res.body.products) {
            expect(
                product.categories.some((category) => {
                    return ["bottoms", "tshirt", "shorts", "skirt"].includes(
                        category
                    );
                })
            ).toBe(true);
        }
    });

    it("should return a list of products with filter 4", async () => {
        const res = await request(app)
            .get("/api/v2/admin/products")
            .query({ attributes: { color: "red", size: "M" } })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.statusCode).toEqual(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                totalPages: expect.any(Number),
                currentPage: expect.any(Number),
                totalItems: expect.any(Number),
                products: expect.any(Array),
            })
        );

        expect(res.body.products.length).toBeGreaterThan(0);
        for (const product of res.body.products) {
            for (const variant of product.variants) {
                let variantWithAttribute = await variantService.getVariant(
                    variant.variantID
                );

                variantWithAttribute =
                    VariantSerializer.parse(variantWithAttribute);

                expect(variantWithAttribute.attributes).toEqual(
                    expect.objectContaining({
                        color: "red",
                        size: "M",
                    })
                );
            }
        }
    });

    it("should return a list of products with pagination", async () => {
        const res = await request(app)
            .get("/api/v2/admin/products")
            .query({ page: 2, size: 3 })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.statusCode).toEqual(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                totalPages: expect.any(Number),
                currentPage: expect.any(Number),
                totalItems: expect.any(Number),
                products: expect.any(Array),
            })
        );

        expect(res.body.products.length).toBeGreaterThan(0);
        expect(res.body.currentPage).toEqual(2);
        expect(res.body.products.length).toBeLessThanOrEqual(3);
    });

    it("should return a list of products with sorting", async () => {
        const res = await request(app)
            .get("/api/v2/admin/products")
            .query({ sort: "price" })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.statusCode).toEqual(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                totalPages: expect.any(Number),
                currentPage: expect.any(Number),
                totalItems: expect.any(Number),
                products: expect.any(Array),
            })
        );

        expect(res.body.products.length).toBeGreaterThan(0);
        let prevPrice = 0;
        for (const product of res.body.products) {
            expect(product.variants[0].price).toBeGreaterThanOrEqual(prevPrice);
            prevPrice = product.variants[0].price;
        }
    });

    it("should return a list of products with sorting 2", async () => {
        const res = await request(app)
            .get("/api/v2/admin/products")
            .query({ sort: "price,-stock" })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.statusCode).toEqual(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                totalPages: expect.any(Number),
                currentPage: expect.any(Number),
                totalItems: expect.any(Number),
                products: expect.any(Array),
            })
        );

        expect(res.body.products.length).toBeGreaterThan(0);
        let prevPrice = 0;
        let prevStock = 0;
        for (const product of res.body.products) {
            expect(product.variants[0].price).toBeGreaterThanOrEqual(prevPrice);
            if (product.variants[0].price === prevPrice) {
                expect(product.variants[0].stock).toBeLessThanOrEqual(
                    prevStock
                );
            }

            prevPrice = product.variants[0].price;
            prevStock = product.variants[0].stock;
        }
    });

    it("should return a list of products with sorting and pagination", async () => {
        const res1 = await request(app)
            .get("/api/v2/admin/products")
            .query({ sort: "price", page: 1, size: 3 })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res1.statusCode).toEqual(StatusCodes.OK);
        expect(res1.body).toEqual(
            expect.objectContaining({
                success: true,
                totalPages: expect.any(Number),
                currentPage: expect.any(Number),
                totalItems: expect.any(Number),
                products: expect.any(Array),
            })
        );

        const res2 = await request(app)
            .get("/api/v2/admin/products")
            .query({ sort: "price", page: 2, size: 3 })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res2.statusCode).toEqual(StatusCodes.OK);
        expect(res2.body).toEqual(
            expect.objectContaining({
                success: true,
                totalPages: expect.any(Number),
                currentPage: expect.any(Number),
                totalItems: expect.any(Number),
                products: expect.any(Array),
            })
        );

        expect(res1.body.products.length).toBeGreaterThan(0);
        expect(res2.body.products.length).toBeGreaterThan(0);

        let prevPrice = 0;
        for (const product of res1.body.products) {
            expect(product.variants[0].price).toBeGreaterThanOrEqual(prevPrice);
            prevPrice = product.variants[0].price;
        }

        for (const product of res2.body.products) {
            expect(product.variants[0].price).toBeGreaterThanOrEqual(prevPrice);
            prevPrice = product.variants[0].price;
        }
    });

    it("should return 400 if query parameters are invalid", async () => {
        const res = await request(app)
            .get("/api/v2/admin/products")
            .query({ page: "invalid", size: "invalid" })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: false,
                errors: expect.any(Array),
            })
        );
    });

    it("should return 401 if access token is missing", async () => {
        const res = await request(app).get("/api/v2/admin/products");

        assertTokenNotProvided(res);
    });

    it("should return 401 if access token is invalid", async () => {
        const res = await request(app)
            .get("/api/v2/admin/products")
            .set("Authorization", `Bearer invalid`);

        assertTokenInvalid(res);
    });

    it("should return 403 if user is not an admin", async () => {
        const res = await request(app)
            .get("/api/v2/admin/products")
            .set("Authorization", `Bearer ${accessTokenUser}`);

        assertNotAnAdmin(res);
    });
});
