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
describe("GET /categories/:categoryName/ascendants", () => {
    it("should return 200 OK with the ascendant categories", async () => {
        const res = await request(app)
            .get("/api/v2/categories/11/ascendants")
            .send();

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            categories: expect.arrayContaining([
                expect.objectContaining({
                    categoryID: "11",
                }),
            ]),
        });

        const categories = res.body.categories;
        for (const category of categories) {
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

    it("should return 200 OK with the ascendant categories 2", async () => {
        const res = await request(app)
            .get("/api/v2/categories/tops/ascendants")
            .send();

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

        const categories = res.body.categories;
        for (const category of categories) {
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

    it("should return only root categories if it is provided", async () => {
        const res = await request(app)
            .get("/api/v2/categories/1/ascendants")
            .send();

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            categories: expect.arrayContaining([
                expect.objectContaining({
                    categoryID: "1",
                }),
            ]),
        });
        expect(res.body.categories.length).toBe(1);
    });

    it("should return 404 Not Found if the category does not exist", async () => {
        const res = await request(app)
            .get("/api/v2/categories/999/ascendants")
            .send();

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: false,
            })
        );
    });
});
