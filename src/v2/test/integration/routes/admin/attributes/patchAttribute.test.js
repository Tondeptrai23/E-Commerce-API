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
describe("PATCH /api/v2/admin/attributes/:attributeID", () => {
    it("should update an attribute", async () => {
        const res = await request(app)
            .patch("/api/v2/admin/attributes/1")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                name: "New name",
            });

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            attribute: expect.objectContaining({
                attributeID: "1",
                name: "New name",
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            }),
        });
    });

    it("should still update name if it is the same", async () => {
        const res = await request(app)
            .patch("/api/v2/admin/attributes/1")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                name: "New name",
            });

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            attribute: expect.objectContaining({
                attributeID: "1",
                name: "New name",
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            }),
        });
    });

    it("should return 404 if attribute is not found", async () => {
        const res = await request(app)
            .patch("/api/v2/admin/attributes/999")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                name: "New name",
            });

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body).toEqual(expect.objectContaining({ success: false }));
    });

    it("should return 409 if name is taken", async () => {
        const res = await request(app)
            .patch("/api/v2/admin/attributes/1")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                name: "color",
            });

        expect(res.status).toBe(StatusCodes.CONFLICT);
        expect(res.body).toEqual(expect.objectContaining({ success: false }));
    });

    it("should return 400 if name is not provided", async () => {
        const res = await request(app)
            .patch("/api/v2/admin/attributes/1")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({});

        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body).toEqual(expect.objectContaining({ success: false }));
    });

    it("should return 401 if token is not provided", async () => {
        const res = await request(app)
            .patch("/api/v2/admin/attributes/1")
            .send({
                name: "New name",
            });

        assertTokenNotProvided(res);
    });

    it("should return 401 if token is invalid", async () => {
        const res = await request(app)
            .patch("/api/v2/admin/attributes/1")
            .set("Authorization", `Bearer invalid`)
            .send({
                name: "New name",
            });

        assertTokenInvalid(res);
    });

    it("should return 401 if user is not an admin", async () => {
        const res = await request(app)
            .patch("/api/v2/admin/attributes/1")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                name: "New name",
            });

        assertNotAnAdmin(res);
    });
});
