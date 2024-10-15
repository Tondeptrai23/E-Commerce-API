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
describe("DELETE /api/v2/cart", () => {
    let cart;
    beforeAll(async () => {
        const res = await request(app)
            .get("/api/v2/cart")
            .set("Authorization", `Bearer ${accessTokenUser}`);
        cart = res.body.cart;
    });

    it("should delete cart", async () => {
        const res = await request(app)
            .delete("/api/v2/cart")
            .set("Authorization", `Bearer ${accessTokenUser}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
        });

        const resCart = await request(app)
            .get("/api/v2/cart")
            .set("Authorization", `Bearer ${accessTokenUser}`);

        expect(resCart.body.cart).toHaveLength(0);
    });

    it("should return 401 if token is not provided", async () => {
        const res = await request(app).delete("/api/v2/cart");

        assertTokenNotProvided(res);
    });

    it("should return 401 if token is invalid", async () => {
        const res = await request(app)
            .delete("/api/v2/cart")
            .set("Authorization", "Bearer invalidtoken");

        assertTokenInvalid(res);
    });
});
