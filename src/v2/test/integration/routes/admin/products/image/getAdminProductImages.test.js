import request from "supertest";
import { StatusCodes } from "http-status-codes";
import app from "../../../../../../app.js";
import seedData from "../../../../../../seedData.js";
import {
    assertNotAnAdmin,
    assertTokenInvalid,
    assertTokenNotProvided,
} from "../../../utils.integration.js";

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
describe("GET /api/v2/admin/products/:productID/images", () => {
    it("should return product images", async () => {
        const res = await request(app)
            .get("/api/v2/admin/products/1/images")
            .set("Authorization", "Bearer " + accessToken);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                images: expect.any(Array),
            })
        );

        expect(res.body.images[0]).toEqual(
            expect.objectContaining({
                imageID: expect.any(String),
                productID: "1",
                url: expect.any(String),
                altText: expect.toBeOneOf([expect.any(String), null]),
                displayOrder: expect.any(Number),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            })
        );
    });

    it("should return product images even if product is deleted", async () => {
        // Delete product
        await request(app)
            .delete("/api/v2/admin/products/1")
            .set("Authorization", "Bearer " + accessToken);

        const res = await request(app)
            .get("/api/v2/admin/products/1/images")
            .set("Authorization", "Bearer " + accessToken);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                images: expect.any(Array),
            })
        );

        expect(res.body.images[0]).toEqual(
            expect.objectContaining({
                imageID: expect.any(String),
                productID: "1",
                url: expect.any(String),
                altText: expect.toBeOneOf([expect.any(String), null]),
                displayOrder: expect.any(Number),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            })
        );
    });

    it("should return 404 if product does not exist", async () => {
        const res = await request(app)
            .get("/api/v2/admin/products/999/images")
            .set("Authorization", "Bearer " + accessToken);

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: false,
                errors: expect.any(Array),
            })
        );
        expect(res.body.errors[0]).toEqual(
            expect.objectContaining({
                error: "NotFound",
                message: "Product not found",
            })
        );
    });

    it("should return 401 if token is not provided", async () => {
        const res = await request(app).get("/api/v2/admin/products/1/images");

        assertTokenNotProvided(res);
    });

    it("should return 401 if token is invalid", async () => {
        const res = await request(app)
            .get("/api/v2/admin/products/1/images")
            .set("Authorization", "Bearer INVALID");

        assertTokenInvalid(res);
    });

    it("should return 403 if user is not an admin", async () => {
        const res = await request(app)
            .get("/api/v2/admin/products/1/images")
            .set("Authorization", "Bearer " + accessTokenUser);

        assertNotAnAdmin(res);
    });
});
