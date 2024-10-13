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
describe("GET /api/v2/admin/users/:userID/cart", () => {
    it("should return user's cart", async () => {
        const res = await request(app)
            .get("/api/v2/admin/users/1/cart")
            .set("Authorization", `Bearer ${accessToken}`)
            .query({
                page: 1,
                size: 2,
            });

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                currentPage: 1,
                totalPages: expect.any(Number),
                totalItems: expect.any(Number),
                cart: expect.any(Array),
            })
        );

        expect(res.body.cart.length).toBeLessThanOrEqual(2);

        for (const cartItem of res.body.cart) {
            expect(cartItem).toEqual(
                expect.objectContaining({
                    cartItemID: expect.any(String),
                    productID: expect.any(String),
                    variantID: expect.any(String),
                    name: expect.any(String),
                    price: expect.any(Number),
                    discountPrice: expect.toBeOneOf([expect.any(Number), null]),
                    quantity: expect.any(Number),
                    totalPrice: expect.any(Number),
                    image: expect.toBeOneOf([expect.any(String), null]),
                })
            );
        }
    });

    it("should return 404 if user does not exist", async () => {
        const res = await request(app)
            .get("/api/v2/admin/users/777")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: false,
            })
        );
    });

    it("should return 401 if token is not provided", async () => {
        const res = await request(app).get("/api/v2/admin/users/1/cart");

        assertTokenNotProvided(res);
    });

    it("should return 401 if token is invalid", async () => {
        const res = await request(app)
            .get("/api/v2/admin/users/1/cart")
            .set("Authorization", "Bearer invalidtoken");

        assertTokenInvalid(res);
    });

    it("should return 403 if user is not an admin", async () => {
        const res = await request(app)
            .get("/api/v2/admin/users/1/cart")
            .set("Authorization", `Bearer ${accessTokenUser}`);

        assertNotAnAdmin(res);
    });
});
