import request from "supertest";
import { StatusCodes } from "http-status-codes";
import app from "../../../../../app.js";
import seedData from "../../../../../seedData.js";
import {
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
describe("GET /api/v2/cart", () => {
    it("should return 200 and cart items", async () => {
        const res = await request(app)
            .get("/api/v2/cart")
            .set("Authorization", `Bearer ${accessTokenUser}`);

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

    it("should return 200 and empty cart", async () => {
        const res = await request(app)
            .get("/api/v2/cart")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                currentPage: 1,
                totalPages: 0,
                totalItems: 0,
                cart: [],
            })
        );
    });

    it("should return 401 if token not provided", async () => {
        const res = await request(app).get("/api/v2/cart");

        assertTokenNotProvided(res);
    });

    it("should return 401 if token invalid", async () => {
        const res = await request(app)
            .get("/api/v2/cart")
            .set("Authorization", `Bearer invalid`);

        assertTokenInvalid(res);
    });
});
