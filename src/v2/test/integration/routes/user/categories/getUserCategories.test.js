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
describe("GET /categories", () => {
    it("should return 200 OK with the categories", async () => {
        const res = await request(app).get("/api/v2/categories").send();

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            currentPage: 1,
            totalPages: expect.any(Number),
            totalItems: expect.any(Number),
            categories: expect.any(Array),
        });

        for (const category of res.body.categories) {
            expect(category).toEqual(
                expect.objectContaining({
                    categoryID: expect.any(String),
                    name: expect.any(String),
                    description: expect.toBeOneOf([null, expect.any(String)]),
                    parentID: expect.toBeOneOf([null, expect.any(String)]),
                })
            );
        }
    });

    it("should return categories with pagination", async () => {
        const res = await request(app).get("/api/v2/categories").query({
            page: 1,
            size: 3,
        });

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            currentPage: 1,
            totalPages: expect.any(Number),
            totalItems: expect.any(Number),
            categories: expect.any(Array),
        });

        expect(res.body.categories.length).toBe(3);
        for (const category of res.body.categories) {
            expect(category).toEqual(
                expect.objectContaining({
                    categoryID: expect.any(String),
                    name: expect.any(String),
                    description: expect.toBeOneOf([null, expect.any(String)]),
                    parentID: expect.toBeOneOf([null, expect.any(String)]),
                })
            );
        }

        const res2 = await request(app).get("/api/v2/categories").query({
            page: 2,
            size: 3,
        });

        expect(res2.status).toBe(StatusCodes.OK);
        expect(res2.body).toEqual({
            success: true,
            currentPage: 2,
            totalPages: expect.any(Number),
            totalItems: expect.any(Number),
            categories: expect.any(Array),
        });

        expect(res2.body.categories.length).toBeLessThanOrEqual(3);

        // Check if the categories are different
        for (const category of res.body.categories) {
            expect(res2.body.categories).not.toContainEqual(category);
        }
    });
});
