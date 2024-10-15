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
describe("GET /api/v2/admin/categories/:categoryName", () => {
    it("should return a category", async () => {
        const res = await request(app)
            .get("/api/v2/admin/categories/tops")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                category: expect.objectContaining({
                    categoryID: expect.any(String),
                    name: "tops",
                    description: expect.toBeOneOf([null, expect.any(String)]),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    parentID: expect.any(String),
                    parent: expect.any(Object),
                }),
            })
        );

        const parent = res.body.category.parent;
        expect(parent).toEqual(
            expect.objectContaining({
                categoryID: expect.any(String),
                name: expect.any(String),
                description: expect.toBeOneOf([null, expect.any(String)]),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                parentID: expect.toBeOneOf([null, expect.any(String)]),
            })
        );
        expect(parent.name).not.toBe("tops");
        expect(parent.parentID).not.toBe(res.body.category.categoryID);
    });

    it("should return 404 if category is not found", async () => {
        const res = await request(app)
            .get("/api/v2/admin/categories/notfound")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: false,
            })
        );
    });

    it("should return 401 if token is not provided", async () => {
        const res = await request(app).get("/api/v2/admin/categories/tops");

        assertTokenNotProvided(res);
    });

    it("should return 401 if token is invalid", async () => {
        const res = await request(app)
            .get("/api/v2/admin/categories/tops")
            .set("Authorization", "Bearer invalidtoken");

        assertTokenInvalid(res);
    });

    it("should return 403 if user is not an admin", async () => {
        const res = await request(app)
            .get("/api/v2/admin/categories/tops")
            .set("Authorization", `Bearer ${accessTokenUser}`);

        assertNotAnAdmin(res);
    });
});
