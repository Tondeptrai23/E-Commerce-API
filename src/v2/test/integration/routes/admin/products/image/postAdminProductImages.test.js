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
describe("POST /api/v2/admin/products/:productID/images", () => {
    it("should add images to a product", async () => {
        const images = (await request(app).get("/api/v2/products/1/images"))
            .body.images;

        const res = await request(app)
            .post("/api/v2/admin/products/1/images")
            .set("Authorization", "Bearer " + accessToken)
            .send({
                images: [
                    {
                        url: "https://example.com/image.jpg",
                        altText: "Image description",
                    },
                    {
                        url: "https://example.com/image2.jpg",
                        altText: "Image description 2",
                    },
                ],
            });
        expect(res.status).toBe(StatusCodes.CREATED);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                images: expect.any(Array),
            })
        );

        const displayOrder = images.length + 1;
        expect(res.body.images).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    url: "https://example.com/image.jpg",
                    altText: "Image description",
                    displayOrder: displayOrder,
                }),
                expect.objectContaining({
                    url: "https://example.com/image2.jpg",
                    altText: "Image description 2",
                    displayOrder: displayOrder + 1,
                }),
            ])
        );
    });

    it("should return 400 if images is not provided", async () => {
        const res = await request(app)
            .post("/api/v2/admin/products/1/images")
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
            .post("/api/v2/admin/products/999/images")
            .set("Authorization", "Bearer " + accessToken)

            .send({
                images: [
                    {
                        url: "https://example.com/image.jpg",
                        altText: "Image description",
                    },
                ],
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

    it("should return 401 if token is not provided", async () => {
        const res = await request(app)
            .post("/api/v2/admin/products/1/images")
            .send({
                images: [
                    {
                        url: "https://example.com/image.jpg",
                        altText: "Image description",
                    },
                ],
            });

        assertTokenNotProvided(res);
    });

    it("should return 401 if token is invalid", async () => {
        const res = await request(app)
            .post("/api/v2/admin/products/1/images")
            .set("Authorization", "Bearer " + "invalidtoken")
            .send({
                images: [
                    {
                        url: "https://example.com/image.jpg",
                        altText: "Image description",
                    },
                ],
            });

        assertTokenInvalid(res);
    });

    it("should return 403 if user is not an admin", async () => {
        const res = await request(app)
            .post("/api/v2/admin/products/1/images")
            .set("Authorization", "Bearer " + accessTokenUser)
            .send({
                images: [
                    {
                        url: "https://example.com/image.jpg",
                        altText: "Image description",
                    },
                ],
            });

        assertNotAnAdmin(res);
    });
});
