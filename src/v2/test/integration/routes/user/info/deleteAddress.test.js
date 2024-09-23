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
describe("DELETE /address/101", () => {
    it("should delete address", async () => {
        const res = await request(app)
            .delete("/api/v2/address/101")
            .set("Authorization", `Bearer ${accessTokenUser}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
        });

        const resGet = await request(app)
            .get("/api/v2/address/101")
            .set("Authorization", `Bearer ${accessTokenUser}`);

        expect(resGet.status).toBe(StatusCodes.NOT_FOUND);
    });

    it("should return 404 if address is not found", async () => {
        const res = await request(app)
            .delete("/api/v2/address/999")
            .set("Authorization", `Bearer ${accessTokenUser}`);

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body).toEqual(expect.objectContaining({ success: false }));
    });

    it("should return 401 if token is not provided", async () => {
        const res = await request(app).delete("/api/v2/address/101").send({
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
            .delete("/api/v2/address/101")
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
