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
describe("GET /admin/products/:productID", () => {
    it("should return a product", async () => {
        const res = await request(app)
            .get("/api/v2/admin/products/1")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.statusCode).toEqual(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                product: expect.objectContaining({
                    productID: expect.any(String),
                    name: expect.any(String),
                    description: expect.any(String),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    variants: expect.any(Array),
                    categories: expect.any(Array),
                    images: expect.any(Array),
                }),
            })
        );

        expect(res.body.product.variants[0]).toEqual(
            expect.objectContaining({
                variantID: expect.any(String),
                name: expect.any(String),
                price: expect.any(Number),
                stock: expect.any(Number),
                attributes: expect.any(Object),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            })
        );

        expect(res.body.product.categories).toEqual(
            expect.arrayContaining([expect.any(String)])
        );

        expect(res.body.product.images).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    imageID: expect.any(String),
                    url: expect.any(String),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                }),
            ])
        );
    });

    it("should return 404 if product does not exist", async () => {
        const res = await request(app)
            .get("/api/v2/admin/products/999")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.statusCode).toEqual(StatusCodes.NOT_FOUND);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: false,
            })
        );
    });

    it("should return product even if it is soft deleted", async () => {
        const res = await request(app)
            .get("/api/v2/admin/products/0")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.statusCode).toEqual(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                product: expect.objectContaining({
                    productID: expect.any(String),
                    name: expect.any(String),
                    description: expect.any(String),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    variants: expect.any(Array),
                    categories: expect.any(Array),
                }),
            })
        );
    });

    it("should return 401 if access token is missing", async () => {
        const res = await request(app).get("/api/v2/admin/products/1");

        assertTokenNotProvided(res);
    });

    it("should return 401 if access token is invalid", async () => {
        const res = await request(app)
            .get("/api/v2/admin/products/1")
            .set("Authorization", `Bearer invalidtoken`);

        assertTokenInvalid(res);
    });

    it("should return 403 if user is not an admin", async () => {
        const res = await request(app)
            .get("/api/v2/admin/products/1")
            .set("Authorization", `Bearer ${accessTokenUser}`);

        assertNotAnAdmin(res);
    });
});
