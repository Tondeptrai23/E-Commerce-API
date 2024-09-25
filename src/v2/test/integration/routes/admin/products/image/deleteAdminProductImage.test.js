import request from "supertest";
import { StatusCodes } from "http-status-codes";
import app from "../../../../../../app.js";
import seedData from "../../../../../../seedData.js";
import {
    assertNotAnAdmin,
    assertTokenInvalid,
    assertTokenNotProvided,
} from "../../../utils.integration.js";
import { jest } from "@jest/globals";
import { s3 } from "../../../../../../config/aws.config.js";

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

    // Mock AWS SDK
    jest.spyOn(s3, "deleteObject").mockImplementation(() => {
        return {
            promise: jest.fn().mockResolvedValue(),
        };
    });
});

/**
 * Tests
 */
describe("DELETE /api/v2/admin/products/:productID/images/:imageID", () => {
    it("should delete an image of a product", async () => {
        const res = await request(app)
            .delete("/api/v2/admin/products/1/images/101")
            .set("Authorization", "Bearer " + accessToken);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
            })
        );

        // Check delete
        const resImage = await request(app)
            .get("/api/v2/admin/products/1/images/101")
            .set("Authorization", "Bearer " + accessToken);

        expect(resImage.status).toBe(StatusCodes.NOT_FOUND);

        // Check display order
        const resImages = await request(app)
            .get("/api/v2/admin/products/1/images")
            .set("Authorization", "Bearer " + accessToken);

        expect(resImages.status).toBe(StatusCodes.OK);
        expect(resImages.body.images).toHaveLength(3);
        expect(resImages.body.images).not.toContainEqual(
            expect.objectContaining({
                imageID: "101",
            })
        );
        expect(resImages.body.images).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ imageID: "102", displayOrder: 1 }),
                expect.objectContaining({ imageID: "103", displayOrder: 2 }),
                expect.objectContaining({ imageID: "104", displayOrder: 3 }),
            ])
        );
    });

    it("should not delete the last image of a product", async () => {
        await request(app)
            .delete("/api/v2/admin/products/1/images/101")
            .set("Authorization", "Bearer " + accessToken);

        await request(app)
            .delete("/api/v2/admin/products/1/images/102")
            .set("Authorization", "Bearer " + accessToken);

        await request(app)
            .delete("/api/v2/admin/products/1/images/103")
            .set("Authorization", "Bearer " + accessToken);

        const res = await request(app)
            .delete("/api/v2/admin/products/1/images/104")
            .set("Authorization", "Bearer " + accessToken);

        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: false,
                errors: expect.any(Array),
            })
        );
        expect(res.body.errors[0]).toEqual({
            error: "BadRequest",
            message: "Cannot delete the last image",
        });
    });

    it("should return 404 if the image is not found", async () => {
        const res = await request(app)
            .delete("/api/v2/admin/products/1/images/999")
            .set("Authorization", "Bearer " + accessToken);

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

    it("should return 404 if the product is not found", async () => {
        const res = await request(app)
            .delete("/api/v2/admin/products/999/images/101")
            .set("Authorization", "Bearer " + accessToken);

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

    it("should return 401 if the token is not provided", async () => {
        const res = await request(app).delete(
            "/api/v2/admin/products/1/images/101"
        );

        assertTokenNotProvided(res);
    });

    it("should return 401 if the token is invalid", async () => {
        const res = await request(app)
            .delete("/api/v2/admin/products/1/images/101")
            .set("Authorization", "Bearer INVALID");

        assertTokenInvalid(res);
    });

    it("should return 403 if the user is not an admin", async () => {
        const res = await request(app)
            .delete("/api/v2/admin/products/1/images/101")
            .set("Authorization", "Bearer " + accessTokenUser);

        assertNotAnAdmin(res);
    });
});
