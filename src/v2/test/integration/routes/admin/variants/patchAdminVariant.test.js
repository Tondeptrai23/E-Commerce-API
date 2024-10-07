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
describe("PATCH /api/v2/admin/variants/:variantID", () => {
    it("should update a variant", async () => {
        const res = await request(app)
            .patch("/api/v2/admin/variants/101")
            .send({
                price: 20,
                stock: 10,
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            variant: expect.any(Object),
        });
        expect(res.body.variant).toEqual(
            expect.objectContaining({
                variantID: "101",
                productID: "1",
                price: 20,
                stock: 10,
                discountPrice: expect.toBeOneOf([expect.any(Number), null]),
                name: expect.any(String),
                sku: expect.any(String),
                imageID: expect.toBeOneOf([expect.any(String), null]),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            })
        );
    });

    it("should update a variant 2", async () => {
        const res = await request(app)
            .patch("/api/v2/admin/variants/101")
            .send({
                name: "New Name",
                price: 10,
                discountPrice: 5,
                stock: 10,
                sku: "SKU",
                imageID: "104",
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            variant: expect.any(Object),
        });
        expect(res.body.variant).toEqual(
            expect.objectContaining({
                variantID: "101",
                productID: "1",
                name: "New Name",
                price: 10,
                discountPrice: 5,
                stock: 10,
                sku: "SKU",
                imageID: "104",
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            })
        );
    });

    it("should return 404 if variant not found", async () => {
        const res = await request(app)
            .patch("/api/v2/admin/variants/999")
            .send({
                price: 10,
                stock: 10,
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body).toEqual(expect.objectContaining({ success: false }));
    });

    it("should return 404 if image not found", async () => {
        const res = await request(app)
            .patch("/api/v2/admin/variants/101")
            .send({
                imageID: "201",
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body).toEqual(expect.objectContaining({ success: false }));
    });

    it("should return 400 if discount price is greater than price", async () => {
        const res = await request(app)
            .patch("/api/v2/admin/variants/101")
            .send({
                price: 10,
                discountPrice: 15,
                stock: 10,
            });

        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body).toEqual(expect.objectContaining({ success: false }));
    });

    it("should return 400 if price is not a number", async () => {
        const res = await request(app)
            .patch("/api/v2/admin/variants/101")
            .send({
                price: "abc",
                stock: 10,
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body).toEqual(expect.objectContaining({ success: false }));
    });

    it("should return 401 if token is not provided", async () => {
        const res = await request(app)
            .patch("/api/v2/admin/variants/101")
            .send({
                price: 10,
                stock: 10,
            });

        assertTokenNotProvided(res);
    });

    it("should return 401 if token is invalid", async () => {
        const res = await request(app)
            .patch("/api/v2/admin/variants/101")
            .set("Authorization", "Bearer invalidtoken")
            .send({
                price: 10,
                stock: 10,
            });

        assertTokenInvalid(res);
    });

    it("should return 403 if user is not an admin", async () => {
        const res = await request(app)
            .patch("/api/v2/admin/variants/101")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                price: 10,
                stock: 10,
            });

        assertNotAnAdmin(res);
    });
});
