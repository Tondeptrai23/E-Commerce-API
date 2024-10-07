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
describe("GET /categories/:categoryName/descendants", () => {
    it("should return 200 OK with the descendant categories", async () => {
        const res = await request(app).get(
            "/api/v2/categories/tops/descendants"
        );

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            categories: expect.arrayContaining([
                expect.objectContaining({
                    categoryID: expect.any(String),
                    name: "tops",
                }),
            ]),
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
            expect(category.createdAt).toBeUndefined();
            expect(category.updatedAt).toBeUndefined();
        }
    });

    it("should return 200 OK with the descendant categories 2", async () => {
        const res = await request(app).get("/api/v2/categories/1/descendants");

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            categories: expect.arrayContaining([
                expect.objectContaining({
                    categoryID: "1",
                }),
            ]),
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
            expect(category.createdAt).toBeUndefined();
            expect(category.updatedAt).toBeUndefined();
        }
    });

    it("should return only leaf categories if it is provided", async () => {
        const res = await request(app).get(
            "/api/v2/categories/blouse/descendants"
        );

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            categories: expect.arrayContaining([
                expect.objectContaining({
                    categoryID: expect.any(String),
                    name: "blouse",
                }),
            ]),
        });
        expect(res.body.categories.length).toBe(1);
    });

    it("should return 404 Not Found if the category is not found", async () => {
        const res = await request(app).get(
            "/api/v2/categories/100/descendants"
        );

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body).toEqual(expect.objectContaining({ success: false }));
    });
});
