import request from "supertest";
import { StatusCodes } from "http-status-codes";
import app from "../../../../../app.js";
import seedData from "../../../../../seedData.js";

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
describe("GET /api/v2/products/:productID/categories", () => {
    it("Should return categories of a product", async () => {
        const res = await request(app).get("/api/v2/products/1/categories");

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                categories: expect.any(Array),
            })
        );

        for (const category of res.body.categories) {
            expect(category).toEqual(
                expect.objectContaining({
                    categoryID: expect.any(String),
                    name: expect.any(String),
                    description: expect.toBeOneOf([null, expect.any(String)]),
                    parentID: expect.any(String),
                })
            );
        }

        const res2 = await request(app).get("/api/v2/products/1");
        const categoryNames = res2.body.product.categories;
        const categoryNamesFromCategories = res.body.categories.map(
            (category) => category.name
        );
        expect(categoryNames).toEqual(
            expect.arrayContaining(categoryNamesFromCategories)
        );
    });

    it("Should return 404 if product does not exist", async () => {
        const res = await request(app).get("/api/v2/products/999/categories");

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
