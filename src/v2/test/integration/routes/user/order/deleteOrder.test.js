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
describe("DELETE /api/v2/orders/:orderID", () => {
    it("should permanently delete a pending order", async () => {
        const res = await request(app)
            .delete("/api/v2/orders/1")
            .set("Authorization", `Bearer ${accessTokenUser}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
        });

        const resGet = await request(app)
            .get("/api/v2/admin/orders/1")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(resGet.status).toBe(StatusCodes.NOT_FOUND);
        expect(resGet.body).toEqual({
            success: false,
            errors: [
                {
                    error: "NotFound",
                    message: "Order not found",
                },
            ],
        });
    });

    it("should remove non-pending order from user's view", async () => {
        const res = await request(app)
            .delete("/api/v2/orders/4")
            .set("Authorization", `Bearer ${accessTokenUser}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
        });

        const resGet = await request(app)
            .get("/api/v2/admin/orders/4")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(resGet.status).toBe(StatusCodes.OK);
        expect(resGet.body).toEqual({
            success: true,
            order: expect.any(Object),
        });
        expect(resGet.body.order.deletedAt).not.toBeNull();
    });

    it("should return 404 if order not found", async () => {
        const res = await request(app)
            .delete("/api/v2/orders/100")
            .set("Authorization", `Bearer ${accessTokenUser}`);

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body).toEqual({
            success: false,
            errors: [
                {
                    error: "NotFound",
                    message: "Order not found",
                },
            ],
        });
    });

    it("should return 401 if token not provided", async () => {
        const res = await request(app).delete("/api/v2/orders/1");

        assertTokenNotProvided(res);
    });

    it("should return 401 if token invalid", async () => {
        const res = await request(app)
            .delete("/api/v2/orders/1")
            .set("Authorization", `Bearer invalid`);

        assertTokenInvalid(res);
    });
});
