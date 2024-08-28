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
let createdProduct = {};
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

    // Add mock product
    const resProduct = await request(app)
        .post("/api/v2/admin/products")
        .set("Authorization", "Bearer " + accessToken)
        .send({
            name: "product",
            description: "description",
            variants: [
                {
                    name: "New Variant",
                    price: 100,
                    stock: 10,
                    sku: "SKU123",
                    attributes: {
                        color: "red",
                        size: "M",
                    },
                },
            ],
        });
    createdProduct = resProduct.body.product.productID;
});

/**
 * Tests
 */
describe("POST /api/v2/admin/products/:productID/categories", () => {
    it("should add categories to product", async () => {
        const res = await request(app)
            .post(`/api/v2/admin/products/${createdProduct}/categories`)
            .set("Authorization", "Bearer " + accessToken)
            .send({ categories: ["shorts", "tshirt"] });

        expect(res.status).toBe(StatusCodes.CREATED);
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

        // Check if the category was added and only once
        const categories = (
            await request(app)
                .get(`/api/v2/admin/products/${createdProduct}/categories`)
                .set("Authorization", "Bearer " + accessToken)
        ).body.categories.map((category) => category.name);
        expect(
            categories.filter((category) => category === "tshirt").length
        ).toBe(1);
        expect(
            categories.filter((category) => category === "shorts").length
        ).toBe(1);
    });

    it("should ignore duplicate categories", async () => {
        const res = await request(app)
            .post(`/api/v2/admin/products/${createdProduct}/categories`)
            .set("Authorization", "Bearer " + accessToken)
            .send({ categories: ["shorts", "blouse"] });

        expect(res.status).toBe(StatusCodes.CREATED);
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

        expect(res.body.product.categories).toEqual(["blouse"]);

        // Check if the category was added and only once
        const categories = (
            await request(app)
                .get(`/api/v2/admin/products/${createdProduct}/categories`)
                .set("Authorization", "Bearer " + accessToken)
        ).body.categories.map((category) => category.name);

        expect(categories).toEqual(
            expect.arrayContaining(["shorts", "tshirt", "blouse"])
        );
    });

    it("should return 400 if categories are not provided", async () => {
        const res = await request(app)
            .post("/api/v2/admin/products/1/categories")
            .set("Authorization", "Bearer " + accessToken)
            .send({});

        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: false,
                errors: expect.any(Array),
            })
        );
    });

    it("should return 404 if product is not found", async () => {
        const res = await request(app)
            .post("/api/v2/admin/products/999/categories")
            .set("Authorization", "Bearer " + accessToken)
            .send({ categories: ["shorts"] });

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
        const res = await request(app)
            .post("/api/v2/admin/products/1/categories")
            .send({ categories: ["shorts"] });

        assertTokenNotProvided(res);
    });

    it("should return 401 if token is invalid", async () => {
        const res = await request(app)
            .post("/api/v2/admin/products/1/categories")
            .set("Authorization", "Bearer INVALID")
            .send({ categories: ["shorts"] });

        assertTokenInvalid(res);
    });

    it("should return 403 if user is not an admin", async () => {
        const res = await request(app)
            .post("/api/v2/admin/products/1/categories")
            .set("Authorization", "Bearer " + accessTokenUser)
            .send({ categories: ["shorts"] });

        assertNotAnAdmin(res);
    });
});
