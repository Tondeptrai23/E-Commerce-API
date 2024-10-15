import request from "supertest";
import { StatusCodes } from "http-status-codes";
import app from "../../../../../app.js";
import seedData from "../../../../../seedData.js";
import {
    assertNotAnAdmin,
    assertTokenInvalid,
    assertTokenNotProvided,
} from "../../utils.integration.js";
import { db } from "../../../../../models/index.model.js";

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

afterAll(async () => {
    await db.close();
    accessToken = null;
    accessTokenUser = null;
});
/**
 * Tests
 */
describe("PUT /api/v2/admin/variants/:variantID", () => {
    it("should replace a variant", async () => {
        const res = await request(app)
            .put("/api/v2/admin/variants/101")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                price: 10,
                stock: 10,
                sku: "sku",
            });

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            variant: expect.any(Object),
        });

        const res2 = await request(app)
            .get("/api/v2/admin/variants/101")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res2.statusCode).toEqual(StatusCodes.OK);
        expect(res2.body).toEqual(
            expect.objectContaining({
                success: true,
                variant: expect.objectContaining({
                    variantID: "101",
                    productID: "1",
                    name: expect.any(String),
                    price: 10,
                    stock: 10,
                    sku: "sku",
                    discountPrice: null,
                    imageID: null,
                    attributes: expect.toBeOneOf([{}, null, undefined]),
                }),
            })
        );
    });

    it("should replace a variant 2", async () => {
        const res = await request(app)
            .put("/api/v2/admin/variants/101")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                price: 12,
                stock: 12,
                sku: "sku 2",
                name: "variant name",
                discountPrice: 10,
                imageID: "103",
                attributes: {
                    size: "L",
                    color: "blue",
                },
            });

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            variant: expect.any(Object),
        });

        const res2 = await request(app)
            .get("/api/v2/admin/variants/101")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res2.statusCode).toEqual(StatusCodes.OK);
        expect(res2.body).toEqual(
            expect.objectContaining({
                success: true,
                variant: expect.objectContaining({
                    variantID: "101",
                    productID: "1",
                    name: "variant name",
                    price: 12,
                    stock: 12,
                    sku: "sku 2",
                    discountPrice: 10,
                    imageID: "103",
                    attributes: {
                        size: "L",
                        color: "blue",
                    },
                }),
            })
        );
    });

    it("should return 404 if variant is not found", async () => {
        const res = await request(app)
            .put("/api/v2/admin/variants/999")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                price: 10,
                stock: 10,
                sku: "sku",
            });

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body).toEqual(expect.objectContaining({ success: false }));
    });

    it("should return 404 if image is not found", async () => {
        const res = await request(app)
            .put("/api/v2/admin/variants/101")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                price: 10,
                stock: 10,
                sku: "sku",
                imageID: "999",
            });

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body).toEqual(expect.objectContaining({ success: false }));
    });

    it("should return 400 if price is not provided", async () => {
        const res = await request(app)
            .put("/api/v2/admin/variants/101")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                stock: 10,
                sku: "sku",
            });

        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body).toEqual(expect.objectContaining({ success: false }));
    });

    it("should return 401 if token is not provided", async () => {
        const res = await request(app).put("/api/v2/admin/variants/101").send({
            price: 10,
            stock: 10,
            sku: "sku",
        });

        assertTokenNotProvided(res);
    });

    it("should return 401 if token is invalid", async () => {
        const res = await request(app)
            .put("/api/v2/admin/variants/101")
            .set("Authorization", "Bearer invalidtoken")
            .send({
                price: 10,
                stock: 10,
                sku: "sku",
            });

        assertTokenInvalid(res);
    });

    it("should return 403 if user is not an admin", async () => {
        const res = await request(app)
            .put("/api/v2/admin/variants/101")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                price: 10,
                stock: 10,
                sku: "sku",
            });

        assertNotAnAdmin(res);
    });
});
