import request from "supertest";
import { StatusCodes } from "http-status-codes";
import app from "../../../../../app.js";
import seedData from "../../../../../seedData.js";
import variantService from "../../../../../services/products/variant.service.js";
import VariantSerializer from "../../../../../services/serializers/variant.serializer.service.js";

/**
 * Set up
 */
beforeAll(async () => {
    // Seed data
    await seedData();
});

/**
 * Tests
 */
describe("GET /api/v2/products/:productID/", () => {
    it("Should return a product", async () => {
        const res = await request(app).get("/api/v2/products/1");

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                product: expect.any(Object),
            })
        );

        const product = res.body.product;
        expect(product).toEqual(
            expect.objectContaining({
                productID: "1",
                name: expect.any(String),
                description: expect.toBeOneOf([null, expect.any(String)]),
                categories: expect.any(Array),
                images: expect.any(Array),
                variants: expect.any(Array),
            })
        );
        expect(product.createdAt).toBeUndefined();
        expect(product.updatedAt).toBeUndefined();

        for (const category of product.categories) {
            expect(category).toEqual(expect.any(String));
        }

        for (const image of product.images) {
            expect(image).toEqual(
                expect.objectContaining({
                    imageID: expect.any(String),
                    url: expect.any(String),
                    altText: expect.toBeOneOf([null, expect.any(String)]),
                    displayOrder: expect.any(Number),
                    productID: "1",
                })
            );
            expect(image.createdAt).toBeUndefined();
            expect(image.updatedAt).toBeUndefined();
        }

        for (const variant of product.variants) {
            expect(variant).toEqual(
                expect.objectContaining({
                    variantID: expect.any(String),
                    name: expect.any(String),
                    price: expect.any(Number),
                    stock: expect.any(Number),
                    discountPrice: expect.toBeOneOf([null, expect.any(Number)]),
                    imageID: expect.toBeOneOf([null, expect.any(String)]),
                    productID: "1",
                })
            );
            expect(variant.createdAt).toBeUndefined();
            expect(variant.updatedAt).toBeUndefined();
        }
    });

    it("Should return 404 if product does not exist", async () => {
        const res = await request(app).get("/api/v2/products/999");

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body).toEqual({
            success: false,
            errors: expect.any(Array),
        });
        expect(res.body.errors[0]).toEqual(
            expect.objectContaining({
                error: "NotFound",
                message: "Product not found",
            })
        );
    });
});
