import request from "supertest";
import { StatusCodes } from "http-status-codes";
import app from "../../../../../app.js";
import seedData from "../../../../../seedData.js";
import {
    assertTokenNotProvided,
    assertTokenInvalid,
    assertNotAnAdmin,
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
describe("put /api/v2/admin/orders/:orderID", () => {
    it("should update an order status", async () => {
        const res = await request(app)
            .put("/api/v2/admin/orders/1/status")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                status: "processing",
            });

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            order: expect.any(Object),
        });
        expect(res.body.order).toEqual(
            expect.objectContaining({
                orderID: "1",
                status: "processing",
            })
        );
    });

    it("should return 409 if order is already cancelled", async () => {
        await request(app)
            .put("/api/v2/admin/orders/2/status")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                status: "cancelled",
            });

        const res = await request(app)
            .put("/api/v2/admin/orders/2/status")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                status: "processing",
            });

        expect(res.status).toBe(StatusCodes.CONFLICT);
        expect(res.body).toEqual(expect.objectContaining({ success: false }));
    });

    it("should return 404 if order is not found", async () => {
        const res = await request(app)
            .put("/api/v2/admin/orders/999/status")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                status: "processing",
            });

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body).toEqual(expect.objectContaining({ success: false }));
    });

    it("should return 400 if status is invalid", async () => {
        const res = await request(app)
            .put("/api/v2/admin/orders/1/status")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                status: "invalid",
            });

        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body).toEqual(expect.objectContaining({ success: false }));
    });

    it("should return 401 if token is not provided", async () => {
        const res = await request(app)
            .put("/api/v2/admin/orders/1/status")
            .send({
                status: "processing",
            });

        assertTokenNotProvided(res);
    });

    it("should return 401 if token is invalid", async () => {
        const res = await request(app)
            .put("/api/v2/admin/orders/1/status")
            .set("Authorization", `Bearer invalid`)
            .send({
                status: "processing",
            });

        assertTokenInvalid(res);
    });

    it("should return 401 if user is not an admin", async () => {
        const res = await request(app)
            .put("/api/v2/admin/orders/1/status")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                status: "processing",
            });

        assertNotAnAdmin(res);
    });
});
