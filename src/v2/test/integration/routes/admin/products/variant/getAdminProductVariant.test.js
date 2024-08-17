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
describe("GET /api/v2/admin/products/:productID/variants/:variantID", () => {
    it("should return a product variant", async () => {
        const res = await request(app)
            .get("/api/v2/admin/products/1/variants/101")
            .set("Authorization", "Bearer " + accessToken);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                variant: expect.objectContaining({
                    variantID: "101",
                    name: expect.any(String),
                    price: expect.any(Number),
                    stock: expect.any(Number),
                    productID: "1",
                    imageID: expect.any(String),
                    image: expect.any(String),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    attributes: expect.objectContaining({
                        color: expect.any(String),
                        size: expect.any(String),
                    }),
                }),
            })
        );
    });

    it("should return a product variant even if it is deleted", async () => {
        const res = await request(app)
            .get("/api/v2/admin/products/1/variants/100")
            .set("Authorization", "Bearer " + accessToken);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                variant: expect.objectContaining({
                    variantID: "100",
                    name: expect.any(String),
                    price: expect.any(Number),
                    stock: expect.any(Number),
                    productID: "1",
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    deletedAt: expect.any(String),
                }),
            })
        );
    });

    it("should return a product variant even if its product is deleted", async () => {
        // Delete product
        await request(app)
            .delete("/api/v2/admin/products/1")
            .set("Authorization", "Bearer " + accessToken);

        const res = await request(app)
            .get("/api/v2/admin/products/1/variants/101")
            .set("Authorization", "Bearer " + accessToken);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                variant: expect.objectContaining({
                    variantID: "101",
                    name: expect.any(String),
                    price: expect.any(Number),
                    stock: expect.any(Number),
                    productID: "1",
                    imageID: expect.any(String),
                    image: expect.any(String),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    attributes: expect.objectContaining({
                        color: expect.any(String),
                        size: expect.any(String),
                    }),
                }),
            })
        );
    });

    it("should return 404 if variant is not found", async () => {
        const res = await request(app)
            .get("/api/v2/admin/products/1/variants/999")
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
                message: "Variant not found",
            })
        );
    });

    it("should return 404 if product is not found", async () => {
        const res = await request(app)
            .get("/api/v2/admin/products/999/variants/101")
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
        const res = await request(app).get(
            "/api/v2/admin/products/1/variants/101"
        );

        assertTokenNotProvided(res);
    });

    it("should return 401 if token is invalid", async () => {
        const res = await request(app)
            .get("/api/v2/admin/products/1/variants/101")
            .set("Authorization", "Bearer " + "invalidtoken");

        assertTokenInvalid(res);
    });

    it("should return 403 if user is not an admin", async () => {
        const res = await request(app)
            .get("/api/v2/admin/products/1/variants/101")
            .set("Authorization", "Bearer " + accessTokenUser);

        assertNotAnAdmin(res);
    });
});
