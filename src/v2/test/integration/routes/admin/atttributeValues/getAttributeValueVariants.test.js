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
describe("GET /api/v2/admin/attributes/:attributeID/values/:valueID/variants", () => {
    it("should get all variants of an attribute", async () => {
        const res = await request(app)
            .get("/api/v2/admin/attributes/3/values/8/variants")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            currentPage: 1,
            totalItems: expect.any(Number),
            totalPages: expect.any(Number),
            variants: expect.any(Array),
        });

        for (const variant of res.body.variants) {
            expect(variant).toEqual({
                variantID: expect.any(String),
                name: expect.any(String),
                price: expect.any(Number),
                discountPrice: expect.toBeOneOf([null, expect.any(Number)]),
                stock: expect.any(Number),
                sku: expect.any(String),
                productID: expect.any(String),
                imageID: expect.toBeOneOf([null, expect.any(String)]),
                image: expect.toBeOneOf([null, expect.any(String), undefined]),
                attributes: expect.any(Object),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            });

            expect(variant.attributes.material).toBe("cotton");
        }
    });

    it("should get all variants of an attribute with pagination", async () => {
        const res = await request(app)
            .get("/api/v2/admin/attributes/3/values/8/variants")
            .query({
                page: "1",
                size: "2",
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            currentPage: 1,
            totalPages: expect.any(Number),
            totalItems: expect.any(Number),
            variants: expect.any(Array),
        });

        for (const variant of res.body.variants) {
            expect(variant.attributes.material).toBe("cotton");
        }

        const res2 = await request(app)
            .get("/api/v2/admin/attributes/3/values/8/variants")
            .query({
                page: "2",
                size: "2",
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res2.status).toBe(StatusCodes.OK);
        expect(res2.body).toEqual({
            success: true,
            currentPage: 2,
            totalPages: expect.any(Number),
            totalItems: expect.any(Number),
            variants: expect.any(Array),
        });

        for (const variant of res2.body.variants) {
            expect(variant.attributes.material).toBe("cotton");
        }
    });

    it("should get all variants of an attribute with filtering", async () => {
        const res = await request(app)
            .get("/api/v2/admin/attributes/3/values/8/variants")
            .query({
                price: "[gte]15",
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            currentPage: 1,
            totalPages: expect.any(Number),
            totalItems: expect.any(Number),
            variants: expect.any(Array),
        });

        for (const variant of res.body.variants) {
            expect(variant.attributes.material).toBe("cotton");
            expect(variant.price).toBeGreaterThanOrEqual(15);
        }
    });

    it("should get all variants of an attribute with filtering 2", async () => {
        const res = await request(app)
            .get("/api/v2/admin/attributes/3/values/8/variants")
            .query({
                price: "[lt]15",
                stock: "[gt]10",
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            currentPage: 1,
            totalPages: expect.any(Number),
            totalItems: expect.any(Number),
            variants: expect.any(Array),
        });

        for (const variant of res.body.variants) {
            expect(variant.attributes.material).toBe("cotton");
            expect(variant.price).toBeLessThan(15);
            expect(variant.stock).toBeGreaterThan(10);
        }
    });

    it("should get all variants of an attribute with sorting", async () => {
        const res = await request(app)
            .get("/api/v2/admin/attributes/3/values/8/variants")
            .query({
                sort: "price",
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            currentPage: 1,
            totalPages: expect.any(Number),
            totalItems: expect.any(Number),
            variants: expect.any(Array),
        });

        let prevPrice = 0;
        for (const variant of res.body.variants) {
            expect(variant.attributes.material).toBe("cotton");
            expect(variant.price).toBeGreaterThanOrEqual(prevPrice);
            prevPrice = variant.price;
        }

        const res2 = await request(app)
            .get("/api/v2/admin/attributes/3/values/8/variants")
            .query({
                sort: "price",
                page: "2",
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res2.status).toBe(StatusCodes.OK);
        expect(res2.body).toEqual({
            success: true,
            currentPage: 2,
            totalPages: expect.any(Number),
            totalItems: expect.any(Number),
            variants: expect.any(Array),
        });

        for (const variant of res2.body.variants) {
            expect(variant.attributes.material).toBe("cotton");
            expect(variant.price).toBeGreaterThanOrEqual(prevPrice);
            prevPrice = variant.price;
        }
    });

    it("should get all variants of an attribute with sorting 2", async () => {
        const res = await request(app)
            .get("/api/v2/admin/attributes/3/values/8/variants")
            .query({
                sort: "-price",
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            currentPage: 1,
            totalPages: expect.any(Number),
            totalItems: expect.any(Number),
            variants: expect.any(Array),
        });

        let prevPrice = Infinity;
        for (const variant of res.body.variants) {
            expect(variant.attributes.material).toBe("cotton");
            expect(variant.price).toBeLessThanOrEqual(prevPrice);
            prevPrice = variant.price;
        }

        const res2 = await request(app)
            .get("/api/v2/admin/attributes/3/values/8/variants")
            .query({
                sort: "-price",
                page: "2",
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res2.status).toBe(StatusCodes.OK);
        expect(res2.body).toEqual({
            success: true,
            currentPage: 2,
            totalPages: expect.any(Number),
            totalItems: expect.any(Number),
            variants: expect.any(Array),
        });

        for (const variant of res2.body.variants) {
            expect(variant.attributes.material).toBe("cotton");
            expect(variant.price).toBeLessThanOrEqual(prevPrice);
            prevPrice = variant.price;
        }
    });

    it("should return 400 if query params are invalid", async () => {
        const res = await request(app)
            .get("/api/v2/admin/attributes/1/values/1/variants")
            .query({
                size: "invalid",
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body).toEqual({
            success: false,
            errors: expect.any(Array),
        });

        expect(res.body.errors[0].message).toBe(
            "Size should be a positive integer"
        );
    });

    it("should return 404 if value is not found", async () => {
        const res = await request(app)
            .get("/api/v2/admin/attributes/1/values/111/variants")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body).toEqual({
            success: false,
            errors: expect.any(Array),
        });

        expect(res.body.errors[0]).toEqual({
            error: "NotFound",
            message: "Attribute value not found",
        });
    });

    it("should return 404 if attribute is not found", async () => {
        const res = await request(app)
            .get("/api/v2/admin/attributes/111/values/1/variants")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body).toEqual({
            success: false,
            errors: expect.any(Array),
        });

        expect(res.body.errors[0]).toEqual({
            error: "NotFound",
            message: "Attribute not found",
        });
    });

    it("should return 401 if token is not provided", async () => {
        const res = await request(app).get(
            "/api/v2/admin/attributes/1/values/1/variants"
        );

        assertTokenNotProvided(res);
    });

    it("should return 401 if token is invalid", async () => {
        const res = await request(app)
            .get("/api/v2/admin/attributes/1/values/1/variants")
            .set("Authorization", `Bearer invalid`);

        assertTokenInvalid(res);
    });

    it("should return 401 if user is not an admin", async () => {
        const res = await request(app)
            .get("/api/v2/admin/attributes/1/values/1/variants")
            .set("Authorization", `Bearer ${accessTokenUser}`);

        assertNotAnAdmin(res);
    });
});
