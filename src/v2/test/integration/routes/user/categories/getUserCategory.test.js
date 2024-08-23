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
describe("GET /categories/:categoryName", () => {
    it("should return 200 OK with the category", async () => {
        const res = await request(app).get("/api/v2/categories/gender").send();

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            category: expect.objectContaining({
                categoryID: expect.any(String),
                name: "gender",
                description: expect.toBeOneOf([null, expect.any(String)]),
                parentID: null,
            }),
        });
        expect(res.body.category.createdAt).toBeUndefined();
        expect(res.body.category.updatedAt).toBeUndefined();
    });

    it("should return 200 OK with the category 2", async () => {
        const res = await request(app).get("/api/v2/categories/tops").send();

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            category: expect.objectContaining({
                categoryID: expect.any(String),
                name: "tops",
                description: expect.toBeOneOf([null, expect.any(String)]),
                parentID: expect.any(String),
            }),
        });
        expect(res.body.category.createdAt).toBeUndefined();
        expect(res.body.category.updatedAt).toBeUndefined();

        const parent = res.body.category.parent;
        expect(parent).toEqual(
            expect.objectContaining({
                categoryID: expect.any(String),
                name: expect.any(String),
                description: expect.toBeOneOf([null, expect.any(String)]),
                parentID: expect.toBeOneOf([null, expect.any(String)]),
            })
        );
    });

    it("should return 404 Not Found if the category does not exist", async () => {
        const res = await request(app).get("/api/v2/categories/999").send();

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body).toEqual({
            success: false,
            errors: [
                {
                    error: "NotFound",
                    message: "Category not found",
                },
            ],
        });
    });
});
