import request from "supertest";
import { StatusCodes } from "http-status-codes";
import app from "../../../../app.js";
import seedData from "../../../../seedData.js";
import { jwt } from "../../../../config/auth.config.js";
import { db } from "../../../../models/index.model.js";

/**
 * Set up
 */
let accessToken = "";
let refreshToken = "";
beforeAll(async () => {
    // Seed data
    await seedData();

    // Sign in
    const res = await request(app).post("/api/v2/auth/signin").send({
        email: "admin@gmail.com",
        password: "adminpassword",
    });
    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
});

afterAll(async () => {
    db.close();
});

/**
 * Tests
 */
describe("POST /auth/refreshToken/reset", () => {
    it("should reset password", async () => {
        const res = await request(app)
            .post("/api/v2/auth/refreshToken/reset")
            .send({ token: refreshToken });

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body.success).toBe(true);
        expect(res.body.accessToken).toBeDefined();
        expect(res.body.refreshToken).toBeDefined();

        const decoded = await jwt.verify(res.body.accessToken, jwt.SECRET_KEY, {
            algorithms: jwt.ALGORITHM,
        });
        expect(decoded.id).toBe("4");
    });

    it("should return 401 if refresh token is invalid", async () => {
        const res = await request(app)
            .post("/api/v2/auth/refreshToken/reset")
            .send({ token: "invalidtoken" });

        expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
        expect(res.body.success).toBe(false);
    });

    it("should return 401 if refresh token is expired", async () => {
        // Create an expired token
        const expiredToken = await jwt.sign(
            { id: "4" },
            jwt.SECRET_REFRESH_KEY,
            {
                algorithm: jwt.ALGORITHM,
                allowInsecureKeySizes: true,
                expiresIn: -1,
            }
        );

        const res = await request(app)
            .post("/api/v2/auth/refreshToken/reset")
            .send({ token: expiredToken });

        expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
        expect(res.body.success).toBe(false);
    });

    it("should return 401 if refresh token is not provided", async () => {
        const res = await request(app).post("/api/v2/auth/refreshToken/reset");

        expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
        expect(res.body.success).toBe(false);
    });
});
