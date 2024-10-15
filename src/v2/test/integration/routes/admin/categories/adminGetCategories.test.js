import request from "supertest";
import { StatusCodes } from "http-status-codes";
import app from "../../../../../app.js";
import seedData from "../../../../../seedData.js";
import {
    assertNotAnAdmin,
    assertTokenInvalid,
    assertTokenNotProvided,
} from "../../utils.integration.js";
import { db } from "../../../../../models/index.model.js";

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

afterAll(async () => {
    await db.close();
    accessToken = null;
    accessTokenUser = null;
});

/**
 * Tests
 */
describe("GET /api/v2/admin/categories", () => {
    it("should return categories", async () => {
        const res = await request(app)
            .get("/api/v2/admin/categories")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                currentPage: 1,
                totalPages: expect.any(Number),
                totalItems: expect.any(Number),
                categories: expect.any(Array),
            })
        );

        const categories = res.body.categories;
        for (const category of categories) {
            expect(category).toEqual(
                expect.objectContaining({
                    categoryID: expect.any(String),
                    name: expect.any(String),
                    description: expect.toBeOneOf([null, expect.any(String)]),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    parentID: expect.toBeOneOf([null, expect.any(String)]),
                })
            );
        }
    });

    it("should return categories with filtering", async () => {
        const res = await request(app)
            .get("/api/v2/admin/categories")
            .set("Authorization", `Bearer ${accessToken}`)
            .query({
                name: "tops",
            });

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            currentPage: 1,
            totalPages: 1,
            totalItems: 1,
            categories: expect.any(Array),
        });

        expect(res.body.categories.length).toBe(1);
        const category = res.body.categories[0];
        expect(category).toEqual(
            expect.objectContaining({
                categoryID: expect.any(String),
                name: "tops",
                description: expect.toBeOneOf([null, expect.any(String)]),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                parentID: expect.toBeOneOf([null, expect.any(String)]),
            })
        );
    });

    it("should return categories with filtering 2", async () => {
        const res = await request(app)
            .get("/api/v2/admin/categories")
            .set("Authorization", `Bearer ${accessToken}`)
            .query({
                name: "[like]t",
            });

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
                    name: expect.stringMatching(/t/i),
                    description: expect.toBeOneOf([null, expect.any(String)]),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    parentID: expect.toBeOneOf([null, expect.any(String)]),
                })
            );
        }
    });

    it("should return categories with filtering 3", async () => {
        const res = await request(app)
            .get("/api/v2/admin/categories")
            .set("Authorization", `Bearer ${accessToken}`)
            .query({
                parentName: "[like]s",
            });

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
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    parentID: expect.any(String),
                    parent: expect.objectContaining({
                        categoryID: expect.any(String),
                        name: expect.stringMatching(/s/i),
                        description: expect.toBeOneOf([
                            null,
                            expect.any(String),
                        ]),
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String),
                        parentID: expect.toBeOneOf([null, expect.any(String)]),
                    }),
                })
            );
        }
    });

    it("should return categories with sorting", async () => {
        const res = await request(app)
            .get("/api/v2/admin/categories")
            .set("Authorization", `Bearer ${accessToken}`)
            .query({
                sort: "name",
            });

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            currentPage: 1,
            totalPages: expect.any(Number),
            totalItems: expect.any(Number),
            categories: expect.any(Array),
        });

        const categories = res.body.categories;
        for (let i = 1; i < categories.length; i++) {
            const category = categories[i];
            const prevCategory = categories[i - 1];
            expect(category.name >= prevCategory.name).toBe(true);
        }
    });

    it("should return categories with sorting 2", async () => {
        const res = await request(app)
            .get("/api/v2/admin/categories")
            .set("Authorization", `Bearer ${accessToken}`)
            .query({
                sort: "-parentID,name",
            });

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            currentPage: 1,
            totalPages: expect.any(Number),
            totalItems: expect.any(Number),
            categories: expect.any(Array),
        });

        const categories = res.body.categories;
        for (let i = 1; i < categories.length; i++) {
            const category = categories[i];
            const prevCategory = categories[i - 1];
            expect(category.parentID <= prevCategory.parentID).toBe(true);

            if (category.parentID === prevCategory.parentID) {
                expect(category.name >= prevCategory.name).toBe(true);
            }
        }
    });

    it("should return categories with pagination", async () => {
        const res = await request(app)
            .get("/api/v2/admin/categories")
            .set("Authorization", `Bearer ${accessToken}`)
            .query({
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
        expect(res.body.totalPages).toBe(res.body.totalItems / 3);

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

        const res2 = await request(app)
            .get("/api/v2/admin/categories")
            .set("Authorization", `Bearer ${accessToken}`)
            .query({
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
        expect(res2.body.totalPages).toBe(res2.body.totalItems / 3);

        expect(res2.body.categories.length).toBe(3);
        for (const category of res2.body.categories) {
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

    it("should return categories with pagination and sorting", async () => {
        const res = await request(app)
            .get("/api/v2/admin/categories")
            .set("Authorization", `Bearer ${accessToken}`)
            .query({
                page: 1,
                size: 3,
                sort: "name",
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
        let prevCategory = res.body.categories[0];
        for (let i = 1; i < res.body.categories.length; i++) {
            const category = res.body.categories[i];
            prevCategory = res.body.categories[i - 1];
            expect(category.name >= prevCategory.name).toBe(true);
        }

        const res2 = await request(app)
            .get("/api/v2/admin/categories")
            .set("Authorization", `Bearer ${accessToken}`)
            .query({
                page: 2,
                size: 3,
                sort: "name",
            });

        expect(res2.status).toBe(StatusCodes.OK);
        expect(res2.body).toEqual({
            success: true,
            currentPage: 2,
            totalPages: expect.any(Number),
            totalItems: expect.any(Number),
            categories: expect.any(Array),
        });

        expect(res2.body.categories.length).toBe(3);
        expect(res2.body.categories[0].name >= prevCategory.name).toBe(true);
        for (let i = 1; i < res2.body.categories.length; i++) {
            const category = res2.body.categories[i];
            prevCategory = res2.body.categories[i - 1];
            expect(category.name >= prevCategory.name).toBe(true);
        }
    });

    it("should return 401 if token is not provided", async () => {
        const res = await request(app).get("/api/v2/admin/categories");

        assertTokenNotProvided(res);
    });

    it("should return 401 if token is invalid", async () => {
        const res = await request(app)
            .get("/api/v2/admin/categories")
            .set("Authorization", "Bearer invalidtoken");

        assertTokenInvalid(res);
    });

    it("should return 403 if user is not an admin", async () => {
        const res = await request(app)
            .get("/api/v2/admin/categories")
            .set("Authorization", `Bearer ${accessTokenUser}`);

        assertNotAnAdmin(res);
    });
});
