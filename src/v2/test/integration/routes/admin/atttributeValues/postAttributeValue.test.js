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
describe("POST /api/v2/admin/attributes/:attributeID/values", () => {
    it("should return 201 and create attribute value", async () => {
        const res = await request(app)
            .post("/api/v2/admin/attributes/1/values")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                value: "New value",
            });

        expect(res.status).toBe(StatusCodes.CREATED);
        expect(res.body).toEqual({
            success: true,
            value: {
                valueID: expect.any(String),
                value: "New value",
                attributeID: "1",
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            },
        });

        const resGet = await request(app)
            .get("/api/v2/admin/attributes")
            .query({ attributeID: "1" })
            .set("Authorization", `Bearer ${accessToken}`);
        expect(resGet.body.attributes[0].values).toContainEqual(
            res.body.value.value
        );
    });

    it("should return 409 if value is taken", async () => {
        const res = await request(app)
            .post("/api/v2/admin/attributes/1/values")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                value: "New value",
            });

        expect(res.status).toBe(StatusCodes.CONFLICT);
        expect(res.body).toEqual({
            success: false,
            errors: expect.any(Array),
        });

        expect(res.body.errors[0].message).toBe("Attribute value is taken");
    });

    it("should return 404 if attribute is not found", async () => {
        const res = await request(app)
            .post("/api/v2/admin/attributes/100/values")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                value: "New value",
            });

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body).toEqual({
            success: false,
            errors: expect.any(Array),
        });

        expect(res.body.errors[0].message).toBe("Attribute not found");
    });

    it("should return 400 if value is not provided", async () => {
        const res = await request(app)
            .post("/api/v2/admin/attributes/1/values")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({});

        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body).toEqual({
            success: false,
            errors: expect.any(Array),
        });

        expect(res.body.errors[0].message).toBe("Value is required");
    });

    it("should return 401 if token is not provided", async () => {
        const res = await request(app)
            .post("/api/v2/admin/attributes/1/values")
            .send({
                value: "New value",
            });

        assertTokenNotProvided(res);
    });

    it("should return 401 if token is invalid", async () => {
        const res = await request(app)
            .post("/api/v2/admin/attributes/1/values")
            .set("Authorization", `Bearer invalid`)
            .send({
                value: "New value",
            });

        assertTokenInvalid(res);
    });

    it("should return 401 if user is not an admin", async () => {
        const res = await request(app)
            .post("/api/v2/admin/attributes/1/values")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                value: "New value",
            });

        assertNotAnAdmin(res);
    });
});
