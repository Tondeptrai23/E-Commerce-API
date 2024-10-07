import request from "supertest";
import { StatusCodes } from "http-status-codes";
import app from "../../../../../app.js";
import seedData from "../../../../../seedData.js";
import {
    assertNotAnAdmin,
    assertTokenInvalid,
    assertTokenNotProvided,
} from "../../utils.integration.js";

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

/**
 * Tests
 */
describe("PUT /api/v2/admin/categories/:categoryName", () => {
    it("should update a category", async () => {
        const res = await request(app)
            .put("/api/v2/admin/categories/blouse")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                name: "topsss",
            });

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                category: expect.objectContaining({
                    categoryID: expect.any(String),
                    name: "topsss",
                    description: null,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    parentID: null,
                }),
            })
        );
    });

    it("should update a category 2", async () => {
        const res = await request(app)
            .put("/api/v2/admin/categories/skirt")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                name: "jeans",
                description: "Tops description",
                parent: "tops",
            });

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                category: expect.objectContaining({
                    categoryID: expect.any(String),
                    name: "jeans",
                    description: "Tops description",
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    parentID: expect.any(String),
                }),
            })
        );
    });

    it("should return 400 if name is not provided", async () => {
        const res = await request(app)
            .put("/api/v2/admin/categories/tops")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                description: "Tops description",
            });

        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: false,
            })
        );
    });

    it("should return 404 if category is not found", async () => {
        const res = await request(app)
            .put("/api/v2/admin/categories/notfound")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                name: "notfound",
            });

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body).toEqual(expect.objectContaining({ success: false }));
    });

    it("should return 404 if parent is not found", async () => {
        const res = await request(app)
            .put("/api/v2/admin/categories/tops")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                name: "tops",
                parent: "notfound",
            });

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body).toEqual(expect.objectContaining({ success: false }));
    });

    it("should return 409 if category already exists", async () => {
        const res = await request(app)
            .put("/api/v2/admin/categories/tops")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                name: "tshirt",
            });

        expect(res.status).toBe(StatusCodes.CONFLICT);
        expect(res.body).toEqual(expect.objectContaining({ success: false }));
    });

    it("should return 401 if token is not provided", async () => {
        const res = await request(app).post("/api/v2/admin/categories").send({
            name: "jeans",
        });

        assertTokenNotProvided(res);
    });

    it("should return 401 if token is invalid", async () => {
        const res = await request(app)
            .post("/api/v2/admin/categories")
            .set("Authorization", "Bearer invalidtoken")
            .send({
                name: "jeans",
            });

        assertTokenInvalid(res);
    });

    it("should return 403 if user is not an admin", async () => {
        const res = await request(app)
            .post("/api/v2/admin/categories")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                name: "jeans",
            });

        assertNotAnAdmin(res);
    });
});
