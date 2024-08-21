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
describe("DELETE /admin/coupons/:couponID/categories/:categoryName", () => {
    beforeEach(async () => {
        // Add category to coupon
        const preRes = await request(app)
            .post("/api/v2/admin/coupons/1/categories")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                categories: ["tops"],
            });
    });

    it("should remove a category from a coupon", async () => {
        const res = await request(app)
            .delete("/api/v2/admin/coupons/1/categories/tops")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
            })
        );

        const res2 = await request(app)
            .get("/api/v2/admin/coupons/1")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res2.status).toBe(StatusCodes.OK);
        expect(res2.body.coupon.categories).not.toContain("tops");
    });

    it("should return 404 if coupon not found", async () => {
        const res = await request(app)
            .delete("/api/v2/admin/coupons/999/categories/tops")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: false,
                errors: expect.any(Array),
            })
        );
        expect(res.body.errors[0].message).toBe("Coupon not found");
    });

    it("should return 404 if category not found", async () => {
        const res = await request(app)
            .delete("/api/v2/admin/coupons/1/categories/category999")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: false,
                errors: expect.any(Array),
            })
        );
        expect(res.body.errors[0].message).toBe("Category not found");
    });

    it("should return 401 if token not provided", async () => {
        const res = await request(app).delete(
            "/api/v2/admin/coupons/1/categories/tops"
        );

        assertTokenNotProvided(res);
    });

    it("should return 401 if token is invalid", async () => {
        const res = await request(app)
            .delete("/api/v2/admin/coupons/1/categories/tops")
            .set("Authorization", `Bearer INVALID`);

        assertTokenInvalid(res);
    });

    it("should return 403 if not an admin", async () => {
        const res = await request(app)
            .delete("/api/v2/admin/coupons/1/categories/tops")
            .set("Authorization", `Bearer ${accessTokenUser}`);

        assertNotAnAdmin(res);
    });
});
