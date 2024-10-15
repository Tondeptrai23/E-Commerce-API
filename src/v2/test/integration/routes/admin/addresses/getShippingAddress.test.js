import request from "supertest";
import { StatusCodes } from "http-status-codes";
import app from "../../../../../app.js";
import seedData from "../../../../../seedData.js";
import {
    assertNotAnAdmin,
    assertTokenInvalid,
    assertTokenNotProvided,
} from "../../utils.integration.js";
import ShippingAddress from "../../../../../models/shopping/shippingAddress.model.js";
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

    await ShippingAddress.create({
        shippingAddressID: "100",
        phoneNumber: "123456789",
        recipientName: "Recipient",
        address: "Address",
        city: "City",
        district: "District",
    });
});

afterAll(async () => {
    await db.close();
    accessToken = null;
    accessTokenUser = null;
});

/**
 * Test cases
 */
describe("GET /admin/address/shipping/:shippingAddressID", () => {
    it("should get shipping address", async () => {
        const res = await request(app)
            .get("/api/v2/admin/address/shipping/100")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                shippingAddress: expect.objectContaining({
                    shippingAddressID: "100",
                    phoneNumber: "123456789",
                    recipientName: "Recipient",
                    address: "Address",
                    city: "City",
                }),
            })
        );
    });

    it("should return 404 if shipping address is not found", async () => {
        const res = await request(app)
            .get("/api/v2/admin/address/shipping/999")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: false,
            })
        );
    });

    it("should return 401 if token is not provided", async () => {
        const res = await request(app).get(
            "/api/v2/admin/address/shipping/100"
        );

        assertTokenNotProvided(res);
    });

    it("should return 401 if token is invalid", async () => {
        const res = await request(app)
            .get("/api/v2/admin/address/shipping/100")
            .set("Authorization", `Bearer invalid`);

        assertTokenInvalid(res);
    });

    it("should return 401 if user is not an admin", async () => {
        const res = await request(app)
            .get("/api/v2/admin/address/shipping/100")
            .set("Authorization", `Bearer ${accessTokenUser}`);

        assertNotAnAdmin(res);
    });
});
