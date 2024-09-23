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
describe("POST /address", () => {
    it("should add address", async () => {
        const res = await request(app)
            .post("/api/v2/address")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                phoneNumber: "123456789",
                recipientName: "Recipient",
                address: "Address",
                city: "City",
                district: "District",
            });

        expect(res.status).toBe(StatusCodes.CREATED);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                address: expect.objectContaining({
                    addressID: expect.any(String),
                    userID: "1",
                    phoneNumber: "123456789",
                    recipientName: "Recipient",
                    address: "Address",
                    city: "City",
                    district: "District",
                    isDefault: false,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                }),
            })
        );
    });

    it("should return 400 if phoneNumber is missing", async () => {
        const res = await request(app)
            .post("/api/v2/address")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                recipientName: "Recipient",
                address: "Address",
                city: "City",
                district: "District",
            });

        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: false,
            })
        );
    });

    it("should return 401 if token is not provided", async () => {
        const res = await request(app).post("/api/v2/address").send({
            phoneNumber: "123456789",
            recipientName: "Recipient",
            address: "Address",
            city: "City",
            district: "District",
        });

        assertTokenNotProvided(res);
    });

    it("should return 401 if token is invalid", async () => {
        const res = await request(app)
            .post("/api/v2/address")
            .set("Authorization", `Bearer invalid`)
            .send({
                phoneNumber: "123456789",
                recipientName: "Recipient",
                address: "Address",
                city: "City",
                district: "District",
            });

        assertTokenInvalid(res);
    });
});
