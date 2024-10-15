import request from "supertest";
import { StatusCodes } from "http-status-codes";
import app from "../../../../../app.js";
import seedData from "../../../../../seedData.js";
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
describe("GET /api/v2/products/:productID/variants", () => {
    it("Should return variants of a product", async () => {
        const res = await request(app).get("/api/v2/products/1/variants");

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                variants: expect.any(Array),
            })
        );
        for (const variant of res.body.variants) {
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
        const res = await request(app).get("/api/v2/products/999/variants");

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body).toEqual(expect.objectContaining({ success: false }));
    });
});
