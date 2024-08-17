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
describe("PATCH /api/v2/admin/products/:productID/images/:imageID", () => {
    it("should update an image of a product", async () => {
        const res = await request(app)
            .patch("/api/v2/admin/products/1/images/101")
            .set("Authorization", "Bearer " + accessToken)
            .send({
                url: "https://example.com/image.jpg",
                altText: "Image description",
            });

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                image: expect.objectContaining({
                    imageID: "101",
                    url: "https://example.com/image.jpg",
                    altText: "Image description",
                    displayOrder: expect.any(Number),
                }),
            })
        );
    });

    it("should return 400 if url is invalid", async () => {
        const res = await request(app)
            .patch("/api/v2/admin/products/1/images/101")
            .set("Authorization", "Bearer " + accessToken)
            .send({
                url: 123123,
                altText: "Image description",
            });

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
            .patch("/api/v2/admin/products/999/images/101")
            .set("Authorization", "Bearer " + accessToken)

            .send({
                url: "https://example.com/image.jpg",
                altText: "Image description",
            });

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: false,
                errors: expect.any(Array),
            })
        );

        expect(res.body.errors[0]).toEqual({
            error: "NotFound",
            message: "Product not found",
        });
    });

    it("should return 404 if image is not found", async () => {
        const res = await request(app)
            .patch("/api/v2/admin/products/1/images/999")
            .set("Authorization", "Bearer " + accessToken)

            .send({
                url: "https://example.com/image.jpg",
                altText: "Image description",
            });

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: false,
                errors: expect.any(Array),
            })
        );

        expect(res.body.errors[0]).toEqual({
            error: "NotFound",
            message: "Image not found",
        });
    });

    it("should return 401 if token is not provided", async () => {
        const res = await request(app)
            .patch("/api/v2/admin/products/1/images/101")
            .send({
                url: "https://example.com/image.jpg",
                altText: "Image description",
            });

        assertTokenNotProvided(res);
    });

    it("should return 401 if token is invalid", async () => {
        const res = await request(app)
            .patch("/api/v2/admin/products/1/images/101")
            .set("Authorization", "Bearer " + "invalidtoken")
            .send({
                url: "https://example.com/image.jpg",
                altText: "Image description",
            });

        assertTokenInvalid(res);
    });

    it("should return 403 if user is not an admin", async () => {
        const res = await request(app)
            .patch("/api/v2/admin/products/1/images/101")
            .set("Authorization", "Bearer " + accessTokenUser)
            .send({
                url: "https://example.com/image.jpg",
                altText: "Image description",
            });

        assertNotAnAdmin(res);
    });
});
