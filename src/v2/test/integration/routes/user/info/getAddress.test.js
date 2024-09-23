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
let accessTokenUser = "";
beforeAll(async () => {
    // Seed data
    await seedData();

    const resUser = await request(app).post("/api/v2/auth/signin").send({
        email: "user1@gmail.com",
        password: "password1",
    });
    accessTokenUser = resUser.body.accessToken;
});

/**
 * Test cases
 */
describe("GET /address/:addressID", () => {
    it("should get user address", async () => {
        const res = await request(app)
            .get("/api/v2/address/101")
            .set("Authorization", `Bearer ${accessTokenUser}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                address: expect.objectContaining({
                    addressID: "101",
                    userID: "1",
                    phoneNumber: expect.any(String),
                    recipientName: expect.any(String),
                    address: expect.any(String),
                    city: expect.any(String),
                    district: expect.any(String),
                    isDefault: expect.any(Boolean),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                }),
            })
        );
    });

    it("should return 404 if address is not found", async () => {
        const res = await request(app)
            .get("/api/v2/address/999")
            .set("Authorization", `Bearer ${accessTokenUser}`);

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: false,
            })
        );
    });

    it("should return 401 if token is not provided", async () => {
        const res = await request(app).get("/api/v2/address/101");

        assertTokenNotProvided(res);
    });

    it("should return 401 if token is invalid", async () => {
        const res = await request(app)
            .get("/api/v2/address/101")
            .set("Authorization", `Bearer invalid`);

        assertTokenInvalid(res);
    });
});
