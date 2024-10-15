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
describe("GET /api/v2/admin/attributes/:attributeID", () => {
    it("should get an attribute", async () => {
        const res = await request(app)
            .get("/api/v2/admin/attributes/1")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            attribute: {
                attributeID: "1",
                name: "size",
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                values: expect.any(Array),
            },
        });

        for (const value of res.body.attribute.values) {
            expect(value).toEqual({
                valueID: expect.any(String),
                value: expect.any(String),
                attributeID: "1",
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            });
        }
    });

    it("should return 404 if attribute is not found", async () => {
        const res = await request(app)
            .get("/api/v2/admin/attributes/999")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                name: "New name",
            });

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body).toEqual(expect.objectContaining({ success: false }));
    });

    it("should return 401 if token is not provided", async () => {
        const res = await request(app).get("/api/v2/admin/attributes/1");

        assertTokenNotProvided(res);
    });

    it("should return 401 if token is invalid", async () => {
        const res = await request(app)
            .get("/api/v2/admin/attributes/1")
            .set("Authorization", `Bearer invalid`);

        assertTokenInvalid(res);
    });

    it("should return 401 if user is not an admin", async () => {
        const res = await request(app)
            .get("/api/v2/admin/attributes/1")
            .set("Authorization", `Bearer ${accessTokenUser}`);

        assertNotAnAdmin(res);
    });
});
