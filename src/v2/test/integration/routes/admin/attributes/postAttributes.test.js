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
describe("POST /api/v2/admin/attributes", () => {
    it("should add a new attribute", async () => {
        const res = await request(app)
            .post("/api/v2/admin/attributes")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                name: "New attribute",
            });

        expect(res.status).toBe(StatusCodes.CREATED);
        expect(res.body).toEqual({
            success: true,
            attribute: {
                attributeID: expect.any(String),
                name: "New attribute",
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                values: expect.toBeOneOf([null, [], undefined]),
            },
        });
    });

    it("should add a new attribute 2", async () => {
        const res = await request(app)
            .post("/api/v2/admin/attributes")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                name: "New attribute 2",
                values: ["value1", "value2", "value3"],
            });

        expect(res.status).toBe(StatusCodes.CREATED);
        expect(res.body).toEqual({
            success: true,
            attribute: {
                attributeID: expect.any(String),
                name: "New attribute 2",
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                values: ["value1", "value2", "value3"],
            },
        });
    });

    it("should return 409 if name is taken", async () => {
        const res = await request(app)
            .post("/api/v2/admin/attributes")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                name: "color",
            });

        expect(res.status).toBe(StatusCodes.CONFLICT);
        expect(res.body).toEqual(expect.objectContaining({ success: false }));
    });

    it("should return 400 if values are duplicated", async () => {
        const res = await request(app)
            .post("/api/v2/admin/attributes")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                name: "New attribute 3",
                values: ["value1", "value1", "value3"],
            });

        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body).toEqual(expect.objectContaining({ success: false }));
    });

    it("should return 400 if name is not provided", async () => {
        const res = await request(app)
            .post("/api/v2/admin/attributes")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({});

        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body).toEqual(expect.objectContaining({ success: false }));
    });

    it("should return 401 if token is not provided", async () => {
        const res = await request(app).post("/api/v2/admin/attributes").send({
            name: "New attribute",
        });

        assertTokenNotProvided(res);
    });

    it("should return 401 if token is invalid", async () => {
        const res = await request(app)
            .post("/api/v2/admin/attributes")
            .set("Authorization", `Bearer invalid`)
            .send({
                name: "New attribute",
            });

        assertTokenInvalid(res);
    });

    it("should return 401 if user is not an admin", async () => {
        const res = await request(app)
            .post("/api/v2/admin/attributes")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                name: "New attribute",
            });

        assertNotAnAdmin(res);
    });
});
