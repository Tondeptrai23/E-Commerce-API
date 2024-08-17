import request from "supertest";
import { StatusCodes } from "http-status-codes";
import app from "../../../../app.js";
import seedData from "../../../../seedData.js";
import {
    assertNotAnAdmin,
    assertTokenInvalid,
    assertTokenNotProvided,
} from "../utils.integration.js";

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
describe("PATCH /admin/products/:productID", () => {
    it("should update a product", async () => {
        const res = await request(app)
            .patch("/api/v2/admin/products/1")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                name: "Updated Product",
                description: "Updated Description",
            });

        expect(res.statusCode).toEqual(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                product: expect.objectContaining({
                    productID: expect.any(String),
                    name: "Updated Product",
                    description: "Updated Description",
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                }),
            })
        );
    });

    it("should return 409 if name already exists", async () => {
        const res = await request(app)
            .patch("/api/v2/admin/products/1")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                name: "Denim Shorts",
                description: "Updated Description",
            });

        expect(res.statusCode).toEqual(StatusCodes.CONFLICT);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: false,
                errors: expect.arrayContaining([
                    expect.objectContaining({
                        error: "Conflict",
                        message: "Product name is taken",
                    }),
                ]),
            })
        );
    });

    it("should return 404 if product not found", async () => {
        const res = await request(app)
            .patch("/api/v2/admin/products/999")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                name: "Updated Product 2",
                description: "Updated Description",
            });

        expect(res.statusCode).toEqual(StatusCodes.NOT_FOUND);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: false,
                errors: expect.arrayContaining([
                    expect.objectContaining({
                        error: "NotFound",
                        message: "Product not found",
                    }),
                ]),
            })
        );
    });

    it("should return 404 if product is deleted", async () => {
        const res = await request(app)
            .patch("/api/v2/admin/products/0")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                name: "Updated Product 3",
                description: "Updated Description",
            });

        expect(res.statusCode).toEqual(StatusCodes.NOT_FOUND);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: false,
                errors: expect.arrayContaining([
                    expect.objectContaining({
                        error: "NotFound",
                        message: "Product not found",
                    }),
                ]),
            })
        );
    });

    it("should return 400 if name is invalid", async () => {
        const res = await request(app)
            .patch("/api/v2/admin/products/1")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                name: { name: "Updated Product" },
                description: "Updated Description",
            });

        expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: false,
                errors: expect.arrayContaining([
                    expect.objectContaining({
                        msg: "Name should be a string",
                    }),
                ]),
            })
        );
    });

    it("should return 401 if token not provided", async () => {
        const res = await request(app).patch("/api/v2/admin/products/1").send({
            name: "Updated Product",
            description: "Updated Description",
        });

        assertTokenNotProvided(res);
    });

    it("should return 401 if token invalid", async () => {
        const res = await request(app)
            .patch("/api/v2/admin/products/1")
            .set("Authorization", `Bearer ${accessToken}a`)
            .send({
                name: "Updated Product",
                description: "Updated Description",
            });

        assertTokenInvalid(res);
    });

    it("should return 403 if not an admin", async () => {
        const res = await request(app)
            .patch("/api/v2/admin/products/1")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                name: "Updated Product",
                description: "Updated Description",
            });

        assertNotAnAdmin(res);
    });
});
