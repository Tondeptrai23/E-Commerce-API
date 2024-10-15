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
describe("GET /api/v2/admin/attributeValues", () => {
    it("should return attribute values", async () => {
        const res = await request(app)
            .get("/api/v2/admin/attributeValues")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            currentPage: 1,
            totalPages: expect.any(Number),
            totalItems: expect.any(Number),
            values: expect.any(Array),
        });

        for (const attributeValue of res.body.values) {
            expect(attributeValue).toEqual({
                valueID: expect.any(String),
                value: expect.any(String),
                attributeID: expect.any(String),
                attribute: expect.any(String),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            });
        }
    });

    it("should return attribute values with pagination", async () => {
        const res = await request(app)
            .get("/api/v2/admin/attributeValues")
            .query({
                size: "3",
                page: "1",
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            currentPage: 1,
            totalPages: expect.any(Number),
            totalItems: expect.any(Number),
            values: expect.any(Array),
        });

        const res2 = await request(app)
            .get("/api/v2/admin/attributeValues")
            .query({
                size: "3",
                page: "2",
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res2.status).toBe(StatusCodes.OK);
        expect(res2.body).toEqual({
            success: true,
            currentPage: 2,
            totalPages: expect.any(Number),
            totalItems: expect.any(Number),
            values: expect.any(Array),
        });

        expect(res.body.values).not.toEqual(res2.body.values);
        expect(res.body.totalItems).toEqual(res2.body.totalItems);
        expect(res.body.totalPages).toEqual(res2.body.totalPages);
    });

    it("should return attribute values with filtering", async () => {
        const res = await request(app)
            .get("/api/v2/admin/attributeValues")
            .query({
                attributeID: "1",
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            currentPage: 1,
            totalPages: expect.any(Number),
            totalItems: expect.any(Number),
            values: expect.any(Array),
        });

        for (const attributeValue of res.body.values) {
            expect(attributeValue.attributeID).toBe("1");
        }
    });

    it("should return attribute values with filtering 2", async () => {
        const res = await request(app)
            .get("/api/v2/admin/attributeValues")
            .query({
                value: "[like]L",
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            currentPage: 1,
            totalPages: expect.any(Number),
            totalItems: expect.any(Number),
            values: expect.any(Array),
        });

        for (const attributeValue of res.body.values) {
            expect(attributeValue.value.toLowerCase()).toContain("l");
        }
    });

    it("should return attribute values with filtering 3", async () => {
        const res = await request(app)
            .get("/api/v2/admin/attributeValues")
            .query({
                value: ["L", "red"],
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            currentPage: 1,
            totalPages: expect.any(Number),
            totalItems: expect.any(Number),
            values: expect.any(Array),
        });

        for (const attributeValue of res.body.values) {
            expect(["L", "red"]).toContain(attributeValue.value);
        }
    });

    it("should return attribute values with filtering 4", async () => {
        const res = await request(app)
            .get("/api/v2/admin/attributeValues")
            .query({
                attributeName: ["size", "material"],
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            currentPage: 1,
            totalPages: expect.any(Number),
            totalItems: expect.any(Number),
            values: expect.any(Array),
        });

        for (const attributeValue of res.body.values) {
            expect(["size", "material"]).toContain(attributeValue.attribute);
        }
    });

    it("should return attribute values with sorting", async () => {
        const res = await request(app)
            .get("/api/v2/admin/attributeValues")
            .query({
                sort: "-value",
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            currentPage: 1,
            totalPages: expect.any(Number),
            totalItems: expect.any(Number),
            values: expect.any(Array),
        });

        for (let i = 0; i < res.body.values.length - 1; i++) {
            expect(
                res.body.values[i].value.localeCompare(
                    res.body.values[i + 1].value
                )
            ).toBeGreaterThanOrEqual(0);
        }

        const res2 = await request(app)
            .get("/api/v2/admin/attributeValues")
            .query({
                sort: "-value",
                page: "2 ",
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res2.status).toBe(StatusCodes.OK);
        expect(res2.body).toEqual({
            success: true,
            currentPage: 2,
            totalPages: expect.any(Number),
            totalItems: expect.any(Number),
            values: expect.any(Array),
        });

        expect(
            res.body.values[res.body.values.length - 1].value.localeCompare(
                res2.body.values[0].value
            )
        ).toBeGreaterThanOrEqual(0);
        for (let i = 0; i < res2.body.values.length - 1; i++) {
            expect(
                res2.body.values[i].value.localeCompare(
                    res2.body.values[i + 1].value
                )
            ).toBeGreaterThanOrEqual(0);
        }
    });

    it("should return attribute values with sorting 2", async () => {
        const res = await request(app)
            .get("/api/v2/admin/attributeValues")
            .query({
                sort: "value",
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            currentPage: 1,
            totalPages: expect.any(Number),
            totalItems: expect.any(Number),
            values: expect.any(Array),
        });

        for (let i = 0; i < res.body.values.length - 1; i++) {
            expect(
                res.body.values[i].value.localeCompare(
                    res.body.values[i + 1].value
                )
            ).toBeLessThanOrEqual(0);
        }

        const res2 = await request(app)
            .get("/api/v2/admin/attributeValues")
            .query({
                sort: "value",
                page: "2 ",
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res2.status).toBe(StatusCodes.OK);
        expect(res2.body).toEqual({
            success: true,
            currentPage: 2,
            totalPages: expect.any(Number),
            totalItems: expect.any(Number),
            values: expect.any(Array),
        });

        expect(
            res.body.values[res.body.values.length - 1].value.localeCompare(
                res2.body.values[0].value
            )
        ).toBeLessThanOrEqual(0);
        for (let i = 0; i < res2.body.values.length - 1; i++) {
            expect(
                res2.body.values[i].value.localeCompare(
                    res2.body.values[i + 1].value
                )
            ).toBeLessThanOrEqual(0);
        }
    });

    it("should return 400 if query params is invalid", async () => {
        const res = await request(app)
            .get("/api/v2/admin/attributeValues")
            .query({
                page: "invalid",
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
        expect(res.body).toEqual(expect.objectContaining({ success: false }));
    });

    it("should return 401 if token is not provided", async () => {
        const res = await request(app).get("/api/v2/admin/attributeValues");

        assertTokenNotProvided(res);
    });

    it("should return 401 if token is invalid", async () => {
        const res = await request(app)
            .get("/api/v2/admin/attributeValues")
            .set("Authorization", `Bearer invalid`);

        assertTokenInvalid(res);
    });

    it("should return 401 if user is not an admin", async () => {
        const res = await request(app)
            .get("/api/v2/admin/attributeValues")
            .set("Authorization", `Bearer ${accessTokenUser}`);

        assertNotAnAdmin(res);
    });
});
