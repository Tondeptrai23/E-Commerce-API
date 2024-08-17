import request from "supertest";
import { StatusCodes } from "http-status-codes";
import app from "../../../../app.js";
import seedData from "../../../../seedData.js";

beforeAll(async () => {
    // Seed data
    await seedData();
}, 15000);

describe("POST /api/v2/auth/signup", () => {
    it("should create user", async () => {
        const res = await request(app).post("/api/v2/auth/signup").send({
            email: "user999@gmail.com",
            password: "password999",
            name: "user999",
        });

        expect(res.status).toBe(StatusCodes.CREATED);
        expect(res.body).toEqual({
            success: true,
        });

        // Check if user is created
        const res2 = await request(app).post("/api/v2/auth/signin").send({
            email: "user999@gmail.com",
            password: "password999",
        });

        expect(res2.status).toBe(StatusCodes.OK);
        expect(res2.body).toHaveProperty("accessToken");
        expect(res2.body).toHaveProperty("refreshToken");
        expect(res2.body).toHaveProperty("user");
        expect(res2.body.user.name).toBe("user999");
    });

    it("should return 400 Bad Request if email is not provided", async () => {
        const res = await request(app).post("/api/v2/auth/signup").send({
            password: "password",
            name: "example",
        });

        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body).toHaveProperty("errors");
        expect(res.body.errors[0]).toEqual(
            expect.objectContaining({
                msg: "Email is required",
            })
        );
    });

    it("should return 409 Conflict if email is already exists", async () => {
        const res = await request(app).post("/api/v2/auth/signup").send({
            email: "admin@gmail.com",
            password: "password",
            name: "admin",
        });

        expect(res.status).toBe(StatusCodes.CONFLICT);
        expect(res.body).toHaveProperty("errors");
        expect(res.body.errors[0]).toEqual(
            expect.objectContaining({
                error: "Conflict",
                message: "Email already exists",
            })
        );
    });
});
