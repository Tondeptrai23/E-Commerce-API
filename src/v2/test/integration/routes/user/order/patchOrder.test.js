import request from "supertest";
import { StatusCodes } from "http-status-codes";
import app from "../../../../../app.js";
import seedData from "../../../../../seedData.js";
import {
    assertTokenNotProvided,
    assertTokenInvalid,
} from "../../utils.integration.js";
import Address from "../../../../../models/user/address.model.js";

/**
 * Set up
 */
let accessToken = "";
let accessTokenUser = "";
let address = {};
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

    // Create an address
    await Address.create({
        addressID: "123",
        userID: "1",
        phoneNumber: "1234567890",
        recipientName: "User 1",
        address: "123 Street",
        city: "City",
        district: "District",
    });
});

/**
 * Tests
 */
describe("PATCH /api/v2/orders/pending", () => {
    let order;
    beforeAll(async () => {
        const res = await request(app)
            .get("/api/v2/orders/pending")
            .set("Authorization", `Bearer ${accessTokenUser}`);

        order = res.body.order;
    });

    it("should update an order", async () => {
        const res = await request(app)
            .patch("/api/v2/orders/pending")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                addressID: "123",
            });

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            order: expect.objectContaining({
                orderID: order.orderID,
                shippingAddress: expect.objectContaining({
                    city: "City",
                    district: "District",
                    recipientName: "User 1",
                    phoneNumber: "1234567890",
                    address: "123 Street",
                }),
            }),
        });

        // Check if order is updated
        const res2 = await request(app)
            .get("/api/v2/orders/pending")
            .set("Authorization", `Bearer ${accessTokenUser}`);

        expect(res2.status).toBe(StatusCodes.OK);
        expect(res2.body).toEqual({
            success: true,
            order: expect.objectContaining({
                orderID: order.orderID,
                shippingAddress: expect.objectContaining({
                    city: "City",
                    district: "District",
                    recipientName: "User 1",
                    phoneNumber: "1234567890",
                    address: "123 Street",
                }),
            }),
        });
        order = res2.body.order;
    });

    it("should update an order 2", async () => {
        const res = await request(app)
            .patch("/api/v2/orders/pending")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                message: "Hello",
            });

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            order: expect.objectContaining({
                orderID: order.orderID,
                message: "Hello",
            }),
        });

        // Check if order is updated
        const res2 = await request(app)
            .get("/api/v2/orders/pending")
            .set("Authorization", `Bearer ${accessTokenUser}`);

        expect(res2.status).toBe(StatusCodes.OK);
        expect(res2.body).toEqual({
            success: true,
            order: expect.objectContaining({
                orderID: order.orderID,
                message: "Hello",
            }),
        });

        order = res2.body.order;
    });

    it("should update an order 3 (ignore provided address)", async () => {
        const address = await Address.findByPk("101");

        const res = await request(app)
            .patch("/api/v2/orders/pending")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                message: null,
                addressID: "101",
                address: {
                    city: "City1",
                    district: "District1",
                    recipientName: "User 11",
                    phoneNumber: "12345678901",
                    address: "123 Street1",
                },
            });

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            order: expect.objectContaining({
                orderID: order.orderID,
                message: null,
                shippingAddress: expect.objectContaining({
                    city: address.city,
                    district: address.district,
                    recipientName: address.recipientName,
                    phoneNumber: address.phoneNumber,
                    address: address.address,
                }),
            }),
        });

        // Check if order is updated
        const res2 = await request(app)
            .get("/api/v2/orders/pending")
            .set("Authorization", `Bearer ${accessTokenUser}`);

        expect(res2.status).toBe(StatusCodes.OK);
        expect(res2.body).toEqual({
            success: true,
            order: expect.objectContaining({
                orderID: order.orderID,
                message: null,
                shippingAddress: expect.objectContaining({
                    city: address.city,
                    district: address.district,
                    recipientName: address.recipientName,
                    phoneNumber: address.phoneNumber,
                    address: address.address,
                }),
            }),
        });

        order = res2.body.order;
    });

    it("should update an order 4 (provide address)", async () => {
        const res = await request(app)
            .patch("/api/v2/orders/pending")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                address: {
                    city: "City1",
                    district: "District1",
                    recipientName: "User 11",
                    phoneNumber: "12345678901",
                    address: "123 Street1",
                },
            });

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            order: expect.objectContaining({
                orderID: order.orderID,
                shippingAddress: expect.objectContaining({
                    city: "City1",
                    district: "District1",
                    recipientName: "User 11",
                    phoneNumber: "12345678901",
                    address: "123 Street1",
                }),
            }),
        });

        // Check if order is updated
        const res2 = await request(app)
            .get("/api/v2/orders/pending")
            .set("Authorization", `Bearer ${accessTokenUser}`);

        expect(res2.status).toBe(StatusCodes.OK);
        expect(res2.body).toEqual({
            success: true,
            order: expect.objectContaining({
                orderID: order.orderID,
                shippingAddress: expect.objectContaining({
                    city: "City1",
                    district: "District1",
                    recipientName: "User 11",
                    phoneNumber: "12345678901",
                    address: "123 Street1",
                }),
            }),
        });

        order = res2.body.order;
    });

    it("should return 404 if order not found", async () => {
        const res = await request(app)
            .patch("/api/v2/orders/pending")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body).toEqual(expect.objectContaining({ success: false }));
    });

    it("should return 404 if address not found", async () => {
        const res = await request(app)
            .patch("/api/v2/orders/pending")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                addressID: "999",
            });

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body).toEqual(expect.objectContaining({ success: false }));
    });

    it("should return 400 if message is not a string", async () => {
        const res = await request(app)
            .patch("/api/v2/orders/pending")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                message: 123,
            });

        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body).toEqual(expect.objectContaining({ success: false }));
    });

    it("should return 401 if token not provided", async () => {
        const res = await request(app).patch("/api/v2/orders/pending");

        assertTokenNotProvided(res);
    });

    it("should return 401 if token invalid", async () => {
        const res = await request(app)
            .patch("/api/v2/orders/pending")
            .set("Authorization", `Bearer invalid`);

        assertTokenInvalid(res);
    });
});
