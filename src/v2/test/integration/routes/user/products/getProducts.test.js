import request from "supertest";
import { StatusCodes } from "http-status-codes";
import app from "../../../../../app.js";
import seedData from "../../../../../seedData.js";
import variantService from "../../../../../services/products/variant.service.js";
import VariantSerializer from "../../../../../services/serializers/variant.serializer.service.js";
import { db } from "../../../../../models/index.model.js";

/**
 * Set up
 */
beforeAll(async () => {
    // Seed data
    await seedData();
});

afterAll(async () => {
    await db.close();
});

/**
 * Tests
 */
describe("GET /api/v2/products", () => {
    it("should return a list of products", async () => {
        const res = await request(app).get("/api/v2/products");

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
                variants: expect.any(Array),
                categories: expect.any(Array),
            })
        );
        expect(res.body.products[0].createdAt).toBeUndefined();
        expect(res.body.products[0].updatedAt).toBeUndefined();

        expect(res.body.products[0].variants[0]).toEqual(
            expect.objectContaining({
                variantID: expect.any(String),
                name: expect.any(String),
                price: expect.any(Number),
                stock: expect.any(Number),
            })
        );
        expect(res.body.products[0].variants[0].createdAt).toBeUndefined();
        expect(res.body.products[0].variants[0].updatedAt).toBeUndefined();
    });

    it("should return a list of products with filter 1", async () => {
        const res = await request(app)
            .get("/api/v2/products")
            .query({ name: "[like]T-Shirt" });

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
            .get("/api/v2/products")
            .query({ variant: { price: "[gte]40", stock: "[gte]10" } });

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
            .get("/api/v2/products")
            .query({ category: ["bottoms", "tshirt"] });

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
            .get("/api/v2/products")
            .query({ attributes: { color: "red", size: "M" } });

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
            .get("/api/v2/products")
            .query({ page: 2, size: 3 });

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
            .get("/api/v2/products")
            .query({ sort: "price" });

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
            .get("/api/v2/products")
            .query({ sort: "price,-stock" });

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
            .get("/api/v2/products")
            .query({ sort: "price", page: 1, size: 3 });

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
            .get("/api/v2/products")
            .query({ sort: "price", page: 2, size: 3 });

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
            .get("/api/v2/products")
            .query({ page: "invalid", size: "invalid" });

        expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: false,
            })
        );
    });

    it("should return 400 if query parameters are invalid for user", async () => {
        const res = await request(app)
            .get("/api/v2/products")
            .query({ createdAt: "[gte]2024-03-03", sort: "-createdAt" });

        expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: false,
            })
        );
    });
});
