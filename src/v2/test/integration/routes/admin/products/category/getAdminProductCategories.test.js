import request from "supertest";
import { StatusCodes } from "http-status-codes";
import app from "../../../../../../app.js";
import seedData from "../../../../../../seedData.js";
import {
    assertNotAnAdmin,
    assertTokenInvalid,
    assertTokenNotProvided,
} from "../../../utils.integration.js";
import { db } from "../../../../../../models/index.model.js";

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
describe("GET /api/v2/admin/products/:productID/categories", () => {
    it("should return product categories", async () => {
        const res = await request(app)
            .get("/api/v2/admin/products/1/categories")
            .set("Authorization", "Bearer " + accessToken);

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
                    description: expect.toBeOneOf([expect.any(String), null]),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                })
            );
        }
    });

    it("should return 404 if product is not found", async () => {
        const res = await request(app)
            .get("/api/v2/admin/products/999/categories")
            .set("Authorization", "Bearer " + accessToken);

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: false,
            })
        );
    });

    it("should return 401 if token is not provided", async () => {
        const res = await request(app).get(
            "/api/v2/admin/products/1/categories"
        );

        assertTokenNotProvided(res);
    });

    it("should return 401 if token is invalid", async () => {
        const res = await request(app)
            .get("/api/v2/admin/products/1/categories")
            .set("Authorization", "Bearer INVALID");

        assertTokenInvalid(res);
    });

    it("should return 403 if user is not an admin", async () => {
        const res = await request(app)
            .get("/api/v2/admin/products/1/categories")
            .set("Authorization", "Bearer " + accessTokenUser);

        assertNotAnAdmin(res);
    });
});
