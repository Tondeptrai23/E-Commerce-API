import request from "supertest";
import { StatusCodes } from "http-status-codes";
import app from "../../../../app.js";
import seedData from "../../../../seedData.js";

beforeAll(async () => {
    // Seed data
    await seedData();
}, 15000);

describe("POST /api/v2/auth/signin", () => {
    it("should return 200 OK", async () => {
        const res = await request(app).post("/api/v2/auth/signin").send({
            email: "admin@gmail.com",
            password: "adminpassword",
        });
        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toHaveProperty("accessToken");
        expect(res.body).toHaveProperty("refreshToken");
        expect(res.body).toHaveProperty("user");

        expect(res.body.user.userID).toBe("4");
    });

    it("should return 404 Not Found if email not exists", async () => {
        const res = await request(app).post("/api/v2/auth/signin").send({
            email: "nonexistence@gmail.com",
            password: "adminpassword",
        });

        expect(res.status).toBe(StatusCodes.NOT_FOUND);
        expect(res.body).toHaveProperty("errors");
        expect(res.body.errors[0]).toEqual(
            expect.objectContaining({
                error: "NotFound",
                message: "Email not found",
            })
        );
    });

    it("should return 401 Unauthorized if password is incorrect", async () => {
        const res = await request(app).post("/api/v2/auth/signin").send({
            email: "admin@gmail.com",
            password: "wrongpassword",
        });

        expect(res.status).toBe(StatusCodes.UNAUTHORIZED);
        expect(res.body).toHaveProperty("errors");
        expect(res.body.errors[0]).toEqual(
            expect.objectContaining({
                error: "Unauthorized",
                message: "Wrong email/password",
            })
        );
    });

    it("should return 400 Bad Request if email is not provided", async () => {
        const res = await request(app).post("/api/v2/auth/signin").send({
            password: "adminpassword",
        });

        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body).toHaveProperty("errors");
        expect(res.body.errors[0]).toEqual(
            expect.objectContaining({
                msg: "Email is required",
            })
        );
    });
});
