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
describe("post /api/v2/admin/variants/:variantID", () => {
    it("should update a variant quantity", async () => {
        const res = await request(app)
            .post("/api/v2/admin/variants/101/quantity")
            .send({
                quantity: 10,
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual(expect.objectContaining({ success: true }));
        expect(res.body.variant.stock).toBeGreaterThanOrEqual(10);
    });

    it("should return 404 if variant not found", async () => {
        const res = await request(app)
            .post("/api/v2/admin/variants/999/quantity")
            .send({
                quantity: 10,
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body).toEqual(expect.objectContaining({ success: false }));
    });

    it("should return 400 if quantity not found", async () => {
        const res = await request(app)
            .post("/api/v2/admin/variants/101/quantity")
            .send({})
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body).toEqual(expect.objectContaining({ success: false }));
    });

    it("should return 401 if token is not provided", async () => {
        const res = await request(app)
            .post("/api/v2/admin/variants/101/quantity")
            .send({
                quantity: 10,
            });

        assertTokenNotProvided(res);
    });

    it("should return 401 if token is invalid", async () => {
        const res = await request(app)
            .post("/api/v2/admin/variants/101/quantity")
            .set("Authorization", "Bearer invalidtoken")
            .send({
                quantity: 10,
            });

        assertTokenInvalid(res);
    });

    it("should return 403 if user is not an admin", async () => {
        const res = await request(app)
            .post("/api/v2/admin/variants/101/quantity")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                quantity: 10,
            });

        assertNotAnAdmin(res);
    });
});
