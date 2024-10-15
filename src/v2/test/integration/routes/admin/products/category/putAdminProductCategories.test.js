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
describe("PUT /api/v2/admin/products/:productID/categories", () => {
    it("should update product categories", async () => {
        const res = await request(app)
            .put("/api/v2/admin/products/1/categories")
            .set("Authorization", "Bearer " + accessToken)
            .send({ categories: ["shorts", "tshirt"] });

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                product: expect.objectContaining({
                    productID: expect.any(String),
                    name: expect.any(String),
                    description: expect.toBeOneOf([expect.any(String), null]),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    categories: expect.any(Array),
                }),
            })
        );
        expect(res.body.product.categories).toEqual(
            expect.arrayContaining(["shorts", "tshirt"])
        );

        // Check if product categories are updated
        const resCategories = await request(app)
            .get("/api/v2/admin/products/1/categories")
            .set("Authorization", "Bearer " + accessToken);

        expect(resCategories.status).toBe(StatusCodes.OK);
        expect(resCategories.body).toEqual(
            expect.objectContaining({
                success: true,
                categories: expect.any(Array),
            })
        );

        const categories = resCategories.body.categories.map(
            (category) => category.name
        );
        expect(categories).toEqual(
            expect.arrayContaining(["shorts", "tshirt"])
        );
        expect(categories).toHaveLength(2);
    });

    it("should delete all categories if categories is an empty array", async () => {
        const res = await request(app)
            .put("/api/v2/admin/products/1/categories")
            .set("Authorization", "Bearer " + accessToken)
            .send({ categories: [] });

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                product: expect.objectContaining({
                    productID: expect.any(String),
                    name: expect.any(String),
                    description: expect.toBeOneOf([expect.any(String), null]),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                }),
            })
        );

        // Check if product categories are updated
        const resCategories = await request(app)
            .get("/api/v2/admin/products/1/categories")
            .set("Authorization", "Bearer " + accessToken);

        expect(resCategories.status).toBe(StatusCodes.OK);
        expect(resCategories.body).toEqual(
            expect.objectContaining({
                success: true,
                categories: [],
            })
        );
    });

    it("should return 400 if categories is not provided", async () => {
        const res = await request(app)
            .put("/api/v2/admin/products/1/categories")
            .set("Authorization", "Bearer " + accessToken)
            .send();

        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: false,
            })
        );
    });

    it("should return 404 if product is not found", async () => {
        const res = await request(app)
            .put("/api/v2/admin/products/999/categories")
            .set("Authorization", "Bearer " + accessToken)
            .send({ categories: ["shorts"] });

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: false,
            })
        );
    });

    it("should return 401 if token is not provided", async () => {
        const res = await request(app)
            .put("/api/v2/admin/products/1/categories")
            .send({ categories: ["shorts"] });

        assertTokenNotProvided(res);
    });

    it("should return 401 if token is invalid", async () => {
        const res = await request(app)
            .put("/api/v2/admin/products/1/categories")
            .set("Authorization", "Bearer INVALID")
            .send({ categories: ["shorts"] });

        assertTokenInvalid(res);
    });

    it("should return 403 if user is not an admin", async () => {
        const res = await request(app)
            .put("/api/v2/admin/products/1/categories")
            .set("Authorization", "Bearer " + accessTokenUser)
            .send({ categories: ["shorts"] });

        assertNotAnAdmin(res);
    });
});
