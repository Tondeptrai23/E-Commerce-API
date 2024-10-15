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
describe("GET /api/v2/admin/orders", () => {
    it("should get all orders", async () => {
        const res = await request(app)
            .get("/api/v2/admin/orders")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            currentPage: 1,
            totalPages: expect.any(Number),
            totalItems: expect.any(Number),
            orders: expect.any(Array),
        });

        for (const order of res.body.orders) {
            expect(order).toEqual(
                expect.objectContaining({
                    orderID: expect.any(String),
                    status: expect.toBeOneOf([
                        "pending",
                        "awaiting payment",
                        "processing",
                        "cancelled",
                        "delivered",
                    ]),
                    message: expect.toBeOneOf([expect.any(String), null]),
                    subTotal: expect.any(Number),
                    finalTotal: expect.any(Number),
                    paymentMethod: expect.any(String),
                    userID: expect.any(String),
                    shippingAddressID: expect.any(String),
                    coupon: expect.any(String),
                })
            );
        }
    });

    it("should get all orders with filtering", async () => {
        const res = await request(app)
            .get("/api/v2/admin/orders")
            .query({
                status: "processing",
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            currentPage: 1,
            totalPages: expect.any(Number),
            totalItems: expect.any(Number),
            orders: expect.any(Array),
        });

        for (const order of res.body.orders) {
            expect(order).toEqual(
                expect.objectContaining({
                    orderID: expect.any(String),
                    status: "processing",
                })
            );
        }
    });

    it("should get all orders with filtering 2", async () => {
        const res = await request(app)
            .get("/api/v2/admin/orders")
            .query({
                status: ["processing", "shipped"],
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            currentPage: 1,
            totalPages: expect.any(Number),
            totalItems: expect.any(Number),
            orders: expect.any(Array),
        });

        for (const order of res.body.orders) {
            expect(order).toEqual(
                expect.objectContaining({
                    orderID: expect.any(String),
                    status: expect.toBeOneOf(["processing", "shipped"]),
                })
            );
        }
    });

    it("should get all orders with filtering 3", async () => {
        const res = await request(app)
            .get("/api/v2/admin/orders")
            .query({
                finalTotal: "[gte]110",
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            currentPage: 1,
            totalPages: expect.any(Number),
            totalItems: expect.any(Number),
            orders: expect.any(Array),
        });

        for (const order of res.body.orders) {
            expect(order.finalTotal).toBeGreaterThanOrEqual(110);
        }
    });

    it("should get all orders with filtering 4", async () => {
        const res = await request(app)
            .get("/api/v2/admin/orders")
            .query({
                finalTotal: "[lte]110",
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            currentPage: 1,
            totalPages: expect.any(Number),
            totalItems: expect.any(Number),
            orders: expect.any(Array),
        });

        for (const order of res.body.orders) {
            expect(order.finalTotal).toBeLessThanOrEqual(110);
        }
    });

    it("should get all orders with filtering 5", async () => {
        const res = await request(app)
            .get("/api/v2/admin/orders")
            .query({
                subTotal: "[gte]110",
                finalTotal: "[lte]110",
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            currentPage: 1,
            totalPages: expect.any(Number),
            totalItems: expect.any(Number),
            orders: expect.any(Array),
        });

        for (const order of res.body.orders) {
            expect(order.subTotal).toBeGreaterThanOrEqual(110);
            expect(order.finalTotal).toBeLessThanOrEqual(110);
        }
    });

    it("should get all orders with filtering 6", async () => {
        const res = await request(app)
            .get("/api/v2/admin/orders")
            .query({
                couponID: ["[ne]1"],
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            currentPage: 1,
            totalPages: expect.any(Number),
            totalItems: expect.any(Number),
            orders: expect.any(Array),
        });

        for (const order of res.body.orders) {
            expect(order.couponID).not.toBe("1");
        }
    });

    it("should get all orders with filtering 7", async () => {
        const res = await request(app)
            .get("/api/v2/admin/orders")
            .query({
                deletedAt: "[ne]2024-01-01",
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            currentPage: 1,
            totalPages: expect.any(Number),
            totalItems: expect.any(Number),
            orders: expect.any(Array),
        });

        for (const order of res.body.orders) {
            expect(
                new Date(order.deletedAt).toISOString().split("T")[0]
            ).not.toBe("2024-01-01");
        }
    });

    it("should get all orders with filtering 8", async () => {
        const res = await request(app)
            .get("/api/v2/admin/orders")
            .query({
                variant: {
                    variantID: ["102", "201"],
                },
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            currentPage: 1,
            totalPages: expect.any(Number),
            totalItems: expect.any(Number),
            orders: expect.any(Array),
        });

        for (const order of res.body.orders) {
            const items = (
                await request(app)
                    .get(`/api/v2/admin/orders/${order.orderID}`)
                    .set("Authorization", `Bearer ${accessToken}`)
            ).body.order.orderItems;

            expect(
                items.some(
                    (item) =>
                        item.variantID === "102" || item.variantID === "201"
                )
            ).toBe(true);
        }
    });

    it("should get all orders with filtering 9", async () => {
        const res = await request(app)
            .get("/api/v2/admin/orders")
            .query({
                variant: {
                    price: "[gte]30",
                },
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            currentPage: 1,
            totalPages: expect.any(Number),
            totalItems: expect.any(Number),
            orders: expect.any(Array),
        });

        for (const order of res.body.orders) {
            const items = (
                await request(app)
                    .get(`/api/v2/admin/orders/${order.orderID}`)
                    .set("Authorization", `Bearer ${accessToken}`)
            ).body.order.orderItems;

            expect(items.some((item) => item.price >= 30)).toBe(true);
        }
    });

    it("should get all orders with filtering 10", async () => {
        const res = await request(app)
            .get("/api/v2/admin/orders")
            .query({
                shippingAddress: {
                    city: "Ha Noi",
                },
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            currentPage: 1,
            totalPages: expect.any(Number),
            totalItems: expect.any(Number),
            orders: expect.any(Array),
        });

        for (const order of res.body.orders) {
            const address = (
                await request(app)
                    .get(`/api/v2/admin/orders/${order.orderID}`)
                    .set("Authorization", `Bearer ${accessToken}`)
            ).body.order.shippingAddress;

            expect(address.city).toBe("Ha Noi");
        }
    });

    it("should get all orders with pagination", async () => {
        const res = await request(app)
            .get("/api/v2/admin/orders")
            .query({
                page: "1",
                size: "2",
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            currentPage: 1,
            totalPages: expect.any(Number),
            totalItems: expect.any(Number),
            orders: expect.any(Array),
        });

        expect(res.body.orders).toHaveLength(2);

        const res2 = await request(app)
            .get("/api/v2/admin/orders")
            .query({
                page: "2",
                size: "2",
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res2.status).toBe(StatusCodes.OK);
        expect(res2.body).toEqual({
            success: true,
            currentPage: 2,
            totalPages: expect.any(Number),
            totalItems: expect.any(Number),
            orders: expect.any(Array),
        });

        expect(res2.body.orders).toHaveLength(2);
    });

    it("should get all orders with sorting", async () => {
        const res = await request(app)
            .get("/api/v2/admin/orders")
            .query({
                sort: "-finalTotal",
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            currentPage: 1,
            totalPages: expect.any(Number),
            totalItems: expect.any(Number),
            orders: expect.any(Array),
        });

        let prevFinalTotal = Infinity;
        for (const order of res.body.orders) {
            expect(order.finalTotal).toBeLessThanOrEqual(prevFinalTotal);
            prevFinalTotal = order.finalTotal;
        }

        const res2 = await request(app)
            .get("/api/v2/admin/orders")
            .query({
                sort: "-finalTotal",
                page: "2",
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res2.status).toBe(StatusCodes.OK);
        expect(res2.body).toEqual({
            success: true,
            currentPage: 2,
            totalPages: expect.any(Number),
            totalItems: expect.any(Number),
            orders: expect.any(Array),
        });

        expect(res2.body.orders[0].finalTotal).toBeLessThanOrEqual(
            prevFinalTotal
        );
        prevFinalTotal = res2.body.orders[0].finalTotal;
        for (const order of res2.body.orders) {
            expect(order.finalTotal).toBeLessThanOrEqual(prevFinalTotal);
            prevFinalTotal = order.finalTotal;
        }
    });

    it("should get all orders with sorting 2", async () => {
        const res = await request(app)
            .get("/api/v2/admin/orders")
            .query({
                sort: "finalTotal,-subTotal",
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            currentPage: 1,
            totalPages: expect.any(Number),
            totalItems: expect.any(Number),
            orders: expect.any(Array),
        });

        let prevFinalTotal = -Infinity;
        let prevSubTotal = Infinity;
        for (const order of res.body.orders) {
            expect(order.finalTotal).toBeGreaterThanOrEqual(prevFinalTotal);
            if (order.finalTotal === prevFinalTotal) {
                expect(order.subTotal).toBeLessThanOrEqual(prevSubTotal);
            }
            prevFinalTotal = order.finalTotal;
        }

        const res2 = await request(app)
            .get("/api/v2/admin/orders")
            .query({
                sort: "finalTotal,-subTotal",
                page: "2",
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res2.status).toBe(StatusCodes.OK);
        expect(res2.body).toEqual({
            success: true,
            currentPage: 2,
            totalPages: expect.any(Number),
            totalItems: expect.any(Number),
            orders: expect.any(Array),
        });

        expect(res2.body.orders[0].finalTotal).toBeGreaterThanOrEqual(
            prevFinalTotal
        );

        prevFinalTotal = res2.body.orders[0].finalTotal;
        for (const order of res2.body.orders) {
            expect(order.finalTotal).toBeGreaterThanOrEqual(prevFinalTotal);
            if (order.finalTotal === prevFinalTotal) {
                expect(order.subTotal).toBeLessThanOrEqual(prevSubTotal);
            }
            prevFinalTotal = order.finalTotal;
        }
    });

    it("should return 400 if query parameter is invalid", async () => {
        const res = await request(app)
            .get("/api/v2/admin/orders")
            .query({
                finalTotal: "[notsupport]invalid",
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: false,
            })
        );
    });

    it("should return 401 if token not provided", async () => {
        const res = await request(app).get("/api/v2/admin/orders");

        assertTokenNotProvided(res);
    });

    it("should return 401 if token invalid", async () => {
        const res = await request(app)
            .get("/api/v2/admin/orders")
            .set("Authorization", `Bearer invalid`);

        assertTokenInvalid(res);
    });

    it("should return 401 if user is not an admin", async () => {
        const res = await request(app)
            .get("/api/v2/admin/orders")
            .set("Authorization", `Bearer ${accessTokenUser}`);

        assertNotAnAdmin(res);
    });
});
