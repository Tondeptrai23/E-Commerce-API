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
describe("DELETE /admin/coupons/:couponID/products/:productID", () => {
    beforeEach(async () => {
        // Add product to coupon
        const preRes = await request(app)
            .post("/api/v2/admin/coupons/1/products")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                productIDs: ["1"],
            });
    });

    it("should remove a product from a coupon", async () => {
        const res = await request(app)
            .delete("/api/v2/admin/coupons/1/products/1")
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
        expect(
            res2.body.coupon.products.map((product) => product.productID)
        ).not.toContain("1");
    });

    it("should return 404 if coupon not found", async () => {
        const res = await request(app)
            .delete("/api/v2/admin/coupons/999/products/1")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: false,
            })
        );
    });

    it("should return 404 if product not found", async () => {
        const res = await request(app)
            .delete("/api/v2/admin/coupons/1/products/999")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: false,
            })
        );
    });

    it("should return 401 if token is not provided", async () => {
        const res = await request(app).delete(
            "/api/v2/admin/coupons/1/products/1"
        );

        assertTokenNotProvided(res);
    });

    it("should return 401 if token is invalid", async () => {
        const res = await request(app)
            .delete("/api/v2/admin/coupons/1/products/1")
            .set("Authorization", "Bearer INVALID");

        assertTokenInvalid(res);
    });

    it("should return 403 if not an admin", async () => {
        const res = await request(app)
            .delete("/api/v2/admin/coupons/1/products/1")
            .set("Authorization", `Bearer ${accessTokenUser}`);

        assertNotAnAdmin(res);
    });
});
