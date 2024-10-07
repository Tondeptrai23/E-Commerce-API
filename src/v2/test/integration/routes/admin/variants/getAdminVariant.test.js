import request from "supertest";
import { StatusCodes } from "http-status-codes";
import app from "../../../../../app.js";
import seedData from "../../../../../seedData.js";
import {
    assertNotAnAdmin,
    assertTokenInvalid,
    assertTokenNotProvided,
} from "../../utils.integration.js";

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
describe("GET /admin/variants/:variantID", () => {
    it("should return a variant", async () => {
        const res = await request(app)
            .get("/api/v2/admin/variants/101")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.statusCode).toEqual(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                variant: expect.objectContaining({
                    variantID: expect.any(String),
                    name: expect.any(String),
                    price: expect.any(Number),
                    stock: expect.any(Number),
                    imageID: expect.any(String),
                    image: expect.any(String),
                    productID: expect.any(String),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                }),
            })
        );

        expect(res.body.variant.attributes).toEqual(
            expect.objectContaining({
                color: expect.any(String),
                size: expect.any(String),
            })
        );
    });

    it("should return a variant even if it is deleted", async () => {
        const res = await request(app)
            .get("/api/v2/admin/variants/100")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.statusCode).toEqual(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                variant: expect.objectContaining({
                    variantID: expect.any(String),
                    name: expect.any(String),
                    price: expect.any(Number),
                    stock: expect.any(Number),
                    imageID: expect.any(String),
                    image: expect.any(String),
                    productID: expect.any(String),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    deletedAt: expect.any(String),
                }),
            })
        );
    });

    it("should return 401 if token is not provided", async () => {
        const res = await request(app).get("/api/v2/admin/variants/101");

        assertTokenNotProvided(res);
    });

    it("should return 401 if token is invalid", async () => {
        const res = await request(app)
            .get("/api/v2/admin/variants/101")
            .set("Authorization", "Bearer invalidtoken");

        assertTokenInvalid(res);
    });

    it("should return 403 if user is not an admin", async () => {
        const res = await request(app)
            .get("/api/v2/admin/variants/101")
            .set("Authorization", `Bearer ${accessTokenUser}`);

        assertNotAnAdmin(res);
    });

    it("should return 404 if variant is not found", async () => {
        const res = await request(app)
            .get("/api/v2/admin/variants/1000")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.statusCode).toEqual(StatusCodes.NOT_FOUND);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: false,
            })
        );
    });
});
