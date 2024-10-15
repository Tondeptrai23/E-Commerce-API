import request from "supertest";
import { StatusCodes } from "http-status-codes";
import app from "../../../../../app.js";
import seedData from "../../../../../seedData.js";
import {
    assertTokenNotProvided,
    assertTokenInvalid,
    assertNotAnAdmin,
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
describe("POST /api/v2/admin/orders/:orderID", () => {
    it("should update an order status", async () => {
        const res = await request(app)
            .post("/api/v2/admin/orders")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                variants: [
                    {
                        variantID: "101",
                        quantity: 1,
                    },
                    {
                        variantID: "102",
                        quantity: 2,
                    },
                ],
                couponCode: "10OFF",
                status: "processing",
                message: "Please ship as soon as possible",
            });

        expect(res.status).toBe(StatusCodes.CREATED);
        expect(res.body).toEqual({
            success: true,
            order: expect.any(Object),
        });

        expect(res.body.order).toEqual(
            expect.objectContaining({
                status: "processing",
                message: "Please ship as soon as possible",
            })
        );

        expect(res.body.order.orderItems).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    variantID: "101",
                    quantity: 1,
                }),
                expect.objectContaining({
                    variantID: "102",
                    quantity: 2,
                }),
            ])
        );
    });

    it("should return 409 if variant is out of stock", async () => {
        const res = await request(app)
            .post("/api/v2/admin/orders")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                variants: [
                    {
                        variantID: "101",
                        quantity: 100,
                    },
                ],
                couponCode: "10OFF",
                status: "processing",
            });

        expect(res.status).toBe(StatusCodes.CONFLICT);
        expect(res.body).toEqual(expect.objectContaining({ success: false }));
    });

    it("should return 400 if body is invalid", async () => {
        const res = await request(app)
            .post("/api/v2/admin/orders")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                variants: [
                    {
                        variantID: "101",
                        quantity: 1,
                    },
                ],
            });

        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body).toEqual(expect.objectContaining({ success: false }));
    });

    it("should return 401 if token is not provided", async () => {
        const res = await request(app)
            .post("/api/v2/admin/orders")
            .send({
                variants: [
                    {
                        variantID: "101",
                        quantity: 1,
                    },
                ],
                status: "processing",
            });

        assertTokenNotProvided(res);
    });

    it("should return 401 if token is invalid", async () => {
        const res = await request(app)
            .post("/api/v2/admin/orders")
            .set("Authorization", `Bearer invalid`)
            .send({
                variants: [
                    {
                        variantID: "101",
                        quantity: 1,
                    },
                ],
                status: "processing",
            });

        assertTokenInvalid(res);
    });

    it("should return 401 if user is not an admin", async () => {
        const res = await request(app)
            .post("/api/v2/admin/orders")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                variants: [
                    {
                        variantID: "101",
                        quantity: 1,
                    },
                ],
                status: "processing",
            });

        assertNotAnAdmin(res);
    });
});
