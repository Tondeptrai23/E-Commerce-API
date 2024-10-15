import request from "supertest";
import { StatusCodes } from "http-status-codes";
import app from "../../../../../app.js";
import seedData from "../../../../../seedData.js";
import {
    assertNotAnAdmin,
    assertTokenInvalid,
    assertTokenNotProvided,
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

    // post access token
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
describe("POST /api/v2/admin/users", () => {
    it("should create a user", async () => {
        const res = await request(app)
            .post("/api/v2/admin/users")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                email: "example@gmail.com",
                password: "examplepassword",
                role: "user",
                name: "example",
            });

        expect(res.status).toBe(StatusCodes.CREATED);

        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                user: expect.objectContaining({
                    email: "example@gmail.com",
                }),
            })
        );
    });

    it("should create a user 2", async () => {
        const res = await request(app)
            .post("/api/v2/admin/users")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                email: "example2@gmail.com",
                password: "examplepassword",
                role: "admin",
                name: "example2",
            });

        expect(res.status).toBe(StatusCodes.CREATED);

        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                user: expect.objectContaining({
                    email: "example2@gmail.com",
                }),
            })
        );
    });

    it("should return 409 if user already exists", async () => {
        const res = await request(app)
            .post("/api/v2/admin/users")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                email: "example@gmail.com",
                password: "examplepassword",
                role: "user",
                name: "example",
            });

        expect(res.status).toBe(StatusCodes.CONFLICT);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: false,
            })
        );
    });

    it("should return 400 if email is missing", async () => {
        const res = await request(app)
            .post("/api/v2/admin/users")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                password: "examplepassword",
                role: "user",
                name: "example",
            });

        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body).toEqual(
            expect.objectContaining({
                success: false,
            })
        );
    });

    it("should return 401 if token is not provided", async () => {
        const res = await request(app).post("/api/v2/admin/users").send({
            email: "example@gmail.com",
            password: "examplepassword",
            role: "user",
            name: "example",
        });

        assertTokenNotProvided(res);
    });

    it("should return 401 if token is invalid", async () => {
        const res = await request(app)
            .post("/api/v2/admin/users")
            .set("Authorization", "Bearer invalidtoken")
            .send({
                email: "example@gmail.com",
                password: "examplepassword",
                role: "user",
                name: "example",
            });

        assertTokenInvalid(res);
    });

    it("should return 403 if user is not an admin", async () => {
        const res = await request(app)
            .post("/api/v2/admin/users")
            .set("Authorization", `Bearer ${accessTokenUser}`)
            .send({
                email: "example@gmail.com",
                password: "examplepassword",
                role: "user",
                name: "example",
            });

        assertNotAnAdmin(res);
    });
});
