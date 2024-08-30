import request from "supertest";
import { StatusCodes } from "http-status-codes";
import app from "../../../../../app.js";
import seedData from "../../../../../seedData.js";
import {
    assertTokenNotProvided,
    assertTokenInvalid,
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
describe("PATCH /api/v2/cart/:variantID", () => {
    let cart;
    beforeAll(async () => {
        const res = await request(app)
            .get("/api/v2/cart")
            .set("Authorization", `Bearer ${accessTokenUser}`);
        cart = res.body.cart;
    });

    it("should update cart item", async () => {
        const res = await request(app)
            .patch(`/api/v2/cart/${cart[0].variantID}`)
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                quantity: 1,
            });

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            cartItem: expect.objectContaining({
                cartItemID: cart[0].cartItemID,
                variantID: cart[0].variantID,
                productID: cart[0].productID,
                name: cart[0].name,
                price: cart[0].price,
                discountPrice: cart[0].discountPrice,
                image: cart[0].image,
                totalPrice: expect.any(Number),
                quantity: 1,
            }),
        });

        expect(res.body.cartItem.totalPrice).toBe(
            res.body.cartItem.discountPrice
                ? res.body.cartItem.discountPrice * res.body.cartItem.quantity
                : res.body.cartItem.price * res.body.cartItem.quantity
        );
    });

    it("should update cart item 2", async () => {
        const res = await request(app)
            .patch(`/api/v2/cart/${cart[1].variantID}`)
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                quantity: 20,
            });

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            cartItem: expect.objectContaining({
                cartItemID: cart[1].cartItemID,
                variantID: cart[1].variantID,
                productID: cart[1].productID,
                name: cart[1].name,
                price: cart[1].price,
                discountPrice: cart[1].discountPrice,
                image: cart[1].image,
                totalPrice: expect.any(Number),
                quantity: 20,
            }),
        });

        expect(res.body.cartItem.totalPrice).toBe(
            res.body.cartItem.discountPrice
                ? res.body.cartItem.discountPrice * res.body.cartItem.quantity
                : res.body.cartItem.price * res.body.cartItem.quantity
        );
    });

    it("should return 400 if quantity is less than 1", async () => {
        const res = await request(app)
            .patch(`/api/v2/cart/${cart[0].variantID}`)
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                quantity: 0,
            });

        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body).toEqual({
            success: false,
            errors: [
                expect.objectContaining({
                    message: "Quantity should be greater than or equal to 1",
                }),
            ],
        });
    });

    it("should return 404 if variantID not found", async () => {
        const res = await request(app)
            .patch(`/api/v2/cart/999`)
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                quantity: 1,
            });

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body).toEqual({
            success: false,
            errors: [
                {
                    error: "NotFound",
                    message: "Cart item not found",
                },
            ],
        });
    });

    it("should return 401 if token not provided", async () => {
        const res = await request(app).patch("/api/v2/cart/102").send({
            quantity: 1,
        });

        assertTokenNotProvided(res);
    });

    it("should return 401 if token invalid", async () => {
        const res = await request(app)
            .patch("/api/v2/cart/102")
            .set("Authorization", `Bearer invalid`)
            .send({
                quantity: 1,
            });

        assertTokenInvalid(res);
    });
});
