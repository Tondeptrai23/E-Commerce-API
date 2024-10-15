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
describe("GET /api/v2/products/:productID/images", () => {
    it("Should return images of a product", async () => {
        const res = await request(app).get("/api/v2/products/1/images");

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                images: expect.any(Array),
            })
        );

        for (let i = 0; i < res.body.images.length; i++) {
            const image = res.body.images[i];
            expect(image).toEqual(
                expect.objectContaining({
                    imageID: expect.any(String),
                    url: expect.any(String),
                    displayOrder: i + 1,
                    productID: "1",
                })
            );
            expect(image.createdAt).toBeUndefined();
            expect(image.updatedAt).toBeUndefined();
        }
    });

    it("Should return 404 if product does not exist", async () => {
        const res = await request(app).get("/api/v2/products/999/images");

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body).toEqual(expect.objectContaining({ success: false }));
    });
});
