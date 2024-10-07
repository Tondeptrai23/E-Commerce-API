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
describe("PATCH /api/v2/admin/products/:productID/images/", () => {
    it("should update the order of images of a product", async () => {
        const res = await request(app)
            .patch("/api/v2/admin/products/1/images")
            .set("Authorization", "Bearer " + accessToken)
            .send({
                images: ["104", "103", "102", "101"],
            });

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                images: expect.arrayContaining([
                    expect.objectContaining({
                        imageID: "101",
                        displayOrder: 4,
                    }),
                    expect.objectContaining({
                        imageID: "102",
                        displayOrder: 3,
                    }),
                    expect.objectContaining({
                        imageID: "103",
                        displayOrder: 2,
                    }),
                    expect.objectContaining({
                        imageID: "104",
                        displayOrder: 1,
                    }),
                ]),
            })
        );
    });

    it("should update the order of images of a product 2", async () => {
        const res = await request(app)
            .patch("/api/v2/admin/products/1/images")
            .set("Authorization", "Bearer " + accessToken)
            .send({
                images: ["103", "102"],
            });

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                images: expect.arrayContaining([
                    expect.objectContaining({
                        imageID: "101",
                        displayOrder: 3,
                    }),
                    expect.objectContaining({
                        imageID: "102",
                        displayOrder: 2,
                    }),
                    expect.objectContaining({
                        imageID: "103",
                        displayOrder: 1,
                    }),
                    expect.objectContaining({
                        imageID: "104",
                        displayOrder: 4,
                    }),
                ]),
            })
        );
    });

    it("should return 400 if images are not provided", async () => {
        const res = await request(app)
            .patch("/api/v2/admin/products/1/images")
            .set("Authorization", "Bearer " + accessToken)
            .send({});

        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: false,
            })
        );
    });

    it("should return 404 if product is not found", async () => {
        const res = await request(app)
            .patch("/api/v2/admin/products/999/images")
            .set("Authorization", "Bearer " + accessToken)
            .send({
                images: ["101", "102", "103", "104"],
            });

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: false,
            })
        );
    });

    it("should return 401 if token is not provided", async () => {
        const res = await request(app)
            .patch("/api/v2/admin/products/1/images")
            .send({
                images: ["101", "102", "103", "104"],
            });
        assertTokenNotProvided(res);
    });

    it("should return 401 if token is invalid", async () => {
        const res = await request(app)
            .patch("/api/v2/admin/products/1/images")
            .set("Authorization", "Bearer " + "invalidtoken")
            .send({
                images: ["101", "102", "103", "104"],
            });

        assertTokenInvalid(res);
    });

    it("should return 403 if user is not an admin", async () => {
        const res = await request(app)
            .patch("/api/v2/admin/products/1/images")
            .set("Authorization", "Bearer " + accessTokenUser)
            .send({
                images: ["101", "102", "103", "104"],
            });

        assertNotAnAdmin(res);
    });
});
