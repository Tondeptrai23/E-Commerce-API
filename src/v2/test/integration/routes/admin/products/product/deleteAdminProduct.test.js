import request from "supertest";
import { StatusCodes } from "http-status-codes";
import app from "../../../../../../app.js";
import seedData from "../../../../../../seedData.js";
import {
    assertNotAnAdmin,
    assertTokenNotProvided,
    assertTokenInvalid,
} from "../../../utils.integration.js";

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
describe("DELETE /api/v2/admin/products/:productID", () => {
    it("should delete a product", async () => {
        const res = await request(app)
            .delete("/api/v2/admin/products/1")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body.success).toBe(true);

        // Check if the product is deleted
        const resGet = await request(app).get("/api/v2/products/1");
        expect(resGet.status).toBe(StatusCodes.NOT_FOUND);
        expect(resGet.body.success).toBe(false);

        // Check if the product is deleted for admin
        const resGetAdmin = await request(app)
            .get("/api/v2/admin/products/1")
            .set("Authorization", `Bearer ${accessToken}`);
        expect(resGetAdmin.status).toBe(StatusCodes.OK);
        expect(resGetAdmin.body.success).toBe(true);
        expect(resGetAdmin.body.product.deletedAt).not.toBe(null);
    });

    it("should return 404 if product is not found", async () => {
        const res = await request(app)
            .delete("/api/v2/admin/products/999")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body.success).toBe(false);
    });

    it("should return 401 if token is not provided", async () => {
        const res = await request(app).delete("/api/v2/admin/products/1");

        assertTokenNotProvided(res);
    });

    it("should return 401 if token is invalid", async () => {
        const res = await request(app)
            .delete("/api/v2/admin/products/1")
            .set("Authorization", "Bearer invalidtoken");

        assertTokenInvalid(res);
    });

    it("should return 403 if user is not an admin", async () => {
        const res = await request(app)
            .delete("/api/v2/admin/products/1")
            .set("Authorization", `Bearer ${accessTokenUser}`);

        assertNotAnAdmin(res);
    });
});
