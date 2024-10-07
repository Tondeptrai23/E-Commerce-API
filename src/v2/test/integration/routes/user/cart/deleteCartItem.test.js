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
describe("DELETE /api/v2/cart/:variantID", () => {
    let cart;
    beforeAll(async () => {
        const res = await request(app)
            .get("/api/v2/cart")
            .set("Authorization", `Bearer ${accessTokenUser}`);
        cart = res.body.cart;
    });

    it("should delete cart item", async () => {
        const res = await request(app)
            .delete(`/api/v2/cart/${cart[0].variantID}`)
            .set("Authorization", `Bearer ${accessTokenUser}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
        });

        const resCart = await request(app)
            .get("/api/v2/cart")
            .set("Authorization", `Bearer ${accessTokenUser}`);

        expect(resCart.body.cart).toHaveLength(cart.length - 1);
        expect(resCart.body.cart).not.toContainEqual(
            expect.objectContaining({
                variantID: cart[0].variantID,
            })
        );
    });

    it("should update cart item 2", async () => {
        const res = await request(app)
            .delete(`/api/v2/cart/${cart[1].variantID}`)
            .set("Authorization", `Bearer ${accessTokenUser}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
        });

        const resCart = await request(app)
            .get("/api/v2/cart")
            .set("Authorization", `Bearer ${accessTokenUser}`);

        expect(resCart.body.cart).toHaveLength(cart.length - 2);
        expect(resCart.body.cart).not.toContainEqual(
            expect.objectContaining({
                variantID: cart[1].variantID,
            })
        );
    });

    it("should return 404 if variantID not found", async () => {
        const res = await request(app)
            .delete(`/api/v2/cart/999`)
            .set("Authorization", `Bearer ${accessTokenUser}`);

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body).toEqual(expect.objectContaining({ success: false }));
    });

    it("should return 401 if token not provided", async () => {
        const res = await request(app).delete("/api/v2/cart/102");

        assertTokenNotProvided(res);
    });

    it("should return 401 if token invalid", async () => {
        const res = await request(app)
            .delete("/api/v2/cart/102")
            .set("Authorization", `Bearer invalid`);

        assertTokenInvalid(res);
    });
});
