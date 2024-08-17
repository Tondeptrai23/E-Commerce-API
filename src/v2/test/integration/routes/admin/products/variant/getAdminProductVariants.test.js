import request from "supertest";
import { EXPECTATION_FAILED, StatusCodes } from "http-status-codes";
import app from "../../../../../../app.js";
import seedData from "../../../../../../seedData.js";
import {
    assertNotAnAdmin,
    assertTokenInvalid,
    assertTokenNotProvided,
} from "../../../utils.integration.js";
import ProductImage from "../../../../../../models/products/productImage.model.js";

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

describe("GET /api/v2/admin/products/:productID/variants", () => {
    it("should return product variants", async () => {
        const res = await request(app)
            .get("/api/v2/admin/products/1/variants")
            .set("Authorization", "Bearer " + accessToken);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                variants: expect.arrayContaining([
                    expect.objectContaining({
                        variantID: expect.any(String),
                        name: expect.any(String),
                        price: expect.any(Number),
                        stock: expect.any(Number),
                        productID: "1",
                        imageID: expect.any(String),
                        image: expect.any(String),
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String),
                        attributes:
                            expect.objectContaining({
                                color: expect.any(String),
                                size: expect.any(String),
                            }) || undefined,
                    }),
                ]),
            })
        );

        expect(res.body.variants.some((variant) => variant.deletedAt)).toBe(
            true
        );
    });

    it("should return product variants even if product is deleted", async () => {
        const res = await request(app)
            .get("/api/v2/admin/products/0/variants")
            .set("Authorization", "Bearer " + accessToken);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                variants: expect.arrayContaining([
                    expect.objectContaining({
                        variantID: expect.any(String),
                        name: expect.any(String),
                        price: expect.any(Number),
                        stock: expect.any(Number),
                        productID: "0",
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String),
                    }),
                ]),
            })
        );
    });

    it("should return 404 if product does not exist", async () => {
        const res = await request(app)
            .get("/api/v2/admin/products/100/variants")
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
        const res = await request(app).get("/api/v2/admin/products/1/variants");

        assertTokenNotProvided(res);
    });

    it("should return 401 if token is invalid", async () => {
        const res = await request(app)
            .get("/api/v2/admin/products/1/variants")
            .set("Authorization", "Bearer " + "invalidtoken");

        assertTokenInvalid(res);
    });

    it("should return 403 if user is not an admin", async () => {
        const res = await request(app)
            .get("/api/v2/admin/products/1/variants")
            .set("Authorization", "Bearer " + accessTokenUser);

        assertNotAnAdmin(res);
    });
});
