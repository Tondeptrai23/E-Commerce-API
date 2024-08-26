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
describe("PATCH /api/v2/admin/attributes/:attributeID/values/:valueID", () => {
    it("should return 200 and update attribute value", async () => {
        const res = await request(app)
            .delete("/api/v2/admin/attributes/1/values/1")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
        });

        const resGet = await request(app)
            .get("/api/v2/admin/attributes/1")
            .set("Authorization", `Bearer ${accessToken}`);
        expect(resGet.body.attribute.values).not.toContainEqual(
            expect.objectContaining({ valueID: "1" })
        );
    });

    it("should return 404 if attribute does not exist", async () => {
        const res = await request(app)
            .delete("/api/v2/admin/attributes/999/values/1")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body).toEqual({
            success: false,
            errors: [
                {
                    error: "NotFound",
                    message: "Attribute not found",
                },
            ],
        });
    });

    it("should return 404 if attribute value does not exist", async () => {
        const res = await request(app)
            .delete("/api/v2/admin/attributes/1/values/999")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body).toEqual({
            success: false,
            errors: [
                {
                    error: "NotFound",
                    message: "Attribute value not found",
                },
            ],
        });
    });

    it("should return 401 if token is not provided", async () => {
        const res = await request(app).delete(
            "/api/v2/admin/attributes/1/values/1"
        );

        assertTokenNotProvided(res);
    });

    it("should return 401 if token is invalid", async () => {
        const res = await request(app)
            .delete("/api/v2/admin/attributes/1/values/1")
            .set("Authorization", `Bearer invalid`);

        assertTokenInvalid(res);
    });

    it("should return 401 if user is not an admin", async () => {
        const res = await request(app)
            .delete("/api/v2/admin/attributes/1/values/1")
            .set("Authorization", `Bearer ${accessTokenUser}`);

        assertNotAnAdmin(res);
    });
});
