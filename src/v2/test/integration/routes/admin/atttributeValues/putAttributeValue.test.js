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
describe("PUT /api/v2/admin/attributes/:attributeID/values/:valueID", () => {
    it("should return 200 and update attribute value", async () => {
        const res = await request(app)
            .put("/api/v2/admin/attributes/1/values/1")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                value: "New value",
            });

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            value: {
                valueID: "1",
                value: "New value",
                attributeID: "1",
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            },
        });

        const resGet = await request(app)
            .get("/api/v2/admin/attributes/1/values/1/variants")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(resGet.status).toBe(StatusCodes.OK);
        expect(resGet.body).toEqual(
            expect.objectContaining({
                success: true,
                variants: [],
            })
        );
    });

    it("should return 409 if value already exists", async () => {
        const res = await request(app)
            .put("/api/v2/admin/attributes/1/values/2")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                value: "New value",
            });

        expect(res.status).toBe(StatusCodes.CONFLICT);
        expect(res.body).toEqual(expect.objectContaining({ success: false }));
    });

    it("should return 400 if value is empty", async () => {
        const res = await request(app)
            .put("/api/v2/admin/attributes/1/values/1")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                value: "",
            });

        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body).toEqual(expect.objectContaining({ success: false }));
    });

    it("should return 400 if value is not provided", async () => {
        const res = await request(app)
            .put("/api/v2/admin/attributes/1/values/1")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({});

        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body).toEqual(expect.objectContaining({ success: false }));
    });

    it("should return 404 if attribute does not exist", async () => {
        const res = await request(app)
            .put("/api/v2/admin/attributes/999/values/1")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                value: "New value",
            });

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body).toEqual(expect.objectContaining({ success: false }));
    });

    it("should return 404 if attribute value does not exist", async () => {
        const res = await request(app)
            .put("/api/v2/admin/attributes/1/values/999")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                value: "New value",
            });

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body).toEqual(expect.objectContaining({ success: false }));
    });

    it("should return 401 if token is not provided", async () => {
        const res = await request(app)
            .put("/api/v2/admin/attributes/1/values/1")
            .send({
                value: "New value",
            });

        assertTokenNotProvided(res);
    });

    it("should return 401 if token is invalid", async () => {
        const res = await request(app)
            .put("/api/v2/admin/attributes/1/values/1")
            .set("Authorization", `Bearer invalid`)
            .send({
                value: "New value",
            });

        assertTokenInvalid(res);
    });

    it("should return 401 if user is not an admin", async () => {
        const res = await request(app)
            .put("/api/v2/admin/attributes/1/values/1")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                value: "New value",
            });

        assertNotAnAdmin(res);
    });
});
