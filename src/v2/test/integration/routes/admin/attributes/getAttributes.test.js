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
describe("GET /api/v2/admin/attributes", () => {
    it("should return all attributes", async () => {
        const res = await request(app)
            .get("/api/v2/admin/attributes")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            currentPage: expect.any(Number),
            totalItems: expect.any(Number),
            totalPages: expect.any(Number),
            attributes: expect.any(Array),
        });

        const attributes = res.body.attributes;
        for (const attribute of attributes) {
            expect(attribute).toEqual(
                expect.objectContaining({
                    attributeID: expect.any(String),
                    name: expect.any(String),
                    values: expect.any(Array),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                })
            );

            expect(
                attribute.values.every((value) => typeof value === "string")
            ).toBe(true);
        }
    });

    it("should return all attributes with filtering", async () => {
        const res = await request(app)
            .get("/api/v2/admin/attributes")
            .query({
                name: ["color", "material"],
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            currentPage: expect.any(Number),
            totalItems: expect.any(Number),
            totalPages: expect.any(Number),
            attributes: expect.any(Array),
        });

        const attributes = res.body.attributes;
        for (const attribute of attributes) {
            expect(attribute).toEqual(
                expect.objectContaining({
                    name: expect.toBeOneOf(["color", "material"]),
                })
            );
        }
    });

    it("should return all attributes with filtering 2", async () => {
        const res = await request(app)
            .get("/api/v2/admin/attributes")
            .query({
                name: "[like]c",
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            currentPage: expect.any(Number),
            totalItems: expect.any(Number),
            totalPages: expect.any(Number),
            attributes: expect.any(Array),
        });

        const attributes = res.body.attributes;
        for (const attribute of attributes) {
            expect(attribute).toEqual(
                expect.objectContaining({ name: expect.stringContaining("c") })
            );
        }
    });

    it("should return all attributes with filtering 3", async () => {
        const res = await request(app)
            .get("/api/v2/admin/attributes")
            .query({
                name: "[ne]color",
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            currentPage: expect.any(Number),
            totalItems: expect.any(Number),
            totalPages: expect.any(Number),
            attributes: expect.any(Array),
        });

        const attributes = res.body.attributes;
        for (const attribute of attributes) {
            expect(attribute).toEqual(
                expect.objectContaining({
                    name: expect.not.stringContaining("color"),
                })
            );
        }
    });

    it("should return all attributes with filtering 4", async () => {
        const res = await request(app)
            .get("/api/v2/admin/attributes")
            .query({
                values: ["red", "blue"],
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            currentPage: expect.any(Number),
            totalItems: expect.any(Number),
            totalPages: expect.any(Number),
            attributes: expect.any(Array),
        });

        const attributes = res.body.attributes;
        for (const attribute of attributes) {
            expect(attribute).toEqual(
                expect.objectContaining({
                    values: expect.toBeOneOf([
                        expect.arrayContaining(["red"]),
                        expect.arrayContaining(["blue"]),
                    ]),
                })
            );
        }
    });

    it("should return all attributes with filtering 5", async () => {
        const res = await request(app)
            .get("/api/v2/admin/attributes")
            .query({
                values: "[like]r",
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            currentPage: expect.any(Number),
            totalItems: expect.any(Number),
            totalPages: expect.any(Number),
            attributes: expect.any(Array),
        });

        const attributes = res.body.attributes;
        for (const attribute of attributes) {
            expect(attribute).toEqual(
                expect.objectContaining({
                    values: expect.arrayContaining([
                        expect.stringContaining("r"),
                    ]),
                })
            );
        }
    });

    it("should return all attributes with pagination", async () => {
        const res = await request(app)
            .get("/api/v2/admin/attributes")
            .query({
                page: "1",
                size: "2",
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            currentPage: 1,
            totalItems: expect.any(Number),
            totalPages: expect.any(Number),
            attributes: expect.any(Array),
        });

        const attributes = res.body.attributes;
        expect(attributes).toHaveLength(2);

        const res2 = await request(app)
            .get("/api/v2/admin/attributes")
            .query({
                page: "2",
                size: "2",
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res2.status).toBe(StatusCodes.OK);
        expect(res2.body).toEqual({
            success: true,
            currentPage: 2,
            totalItems: expect.any(Number),
            totalPages: expect.any(Number),
            attributes: expect.any(Array),
        });
    });

    it("should return all attributes with sorting", async () => {
        const res = await request(app)
            .get("/api/v2/admin/attributes")
            .query({
                sort: "-name",
                size: "3",
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            currentPage: expect.any(Number),
            totalItems: expect.any(Number),
            totalPages: expect.any(Number),
            attributes: expect.any(Array),
        });

        const attributes = res.body.attributes;
        for (let i = 0; i < attributes.length - 1; i++) {
            expect(attributes[i].name > attributes[i + 1].name).toBe(true);
        }

        const res2 = await request(app)
            .get("/api/v2/admin/attributes")
            .query({
                sort: "-name",
                size: "3",
                page: "2",
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res2.status).toBe(StatusCodes.OK);
        expect(res2.body).toEqual({
            success: true,
            currentPage: 2,
            totalItems: expect.any(Number),
            totalPages: expect.any(Number),
            attributes: expect.any(Array),
        });

        const attributes2 = res2.body.attributes;
        for (let i = 0; i < attributes2.length - 1; i++) {
            expect(attributes2[i].name > attributes2[i + 1].name).toBe(true);
        }

        expect(
            attributes[attributes.length - 1].name > attributes2[0].name
        ).toBe(true);
    });

    it("should return all attributes with sorting 2", async () => {
        const res = await request(app)
            .get("/api/v2/admin/attributes")
            .query({
                sort: "name",
                size: "3",
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.status).toBe(StatusCodes.OK);
        expect(res.body).toEqual({
            success: true,
            currentPage: expect.any(Number),
            totalItems: expect.any(Number),
            totalPages: expect.any(Number),
            attributes: expect.any(Array),
        });

        const attributes = res.body.attributes;
        for (let i = 0; i < attributes.length - 1; i++) {
            expect(attributes[i].name < attributes[i + 1].name).toBe(true);
        }

        const res2 = await request(app)
            .get("/api/v2/admin/attributes")
            .query({
                sort: "name",
                page: "2",
                size: "3",
            })
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res2.status).toBe(StatusCodes.OK);
        expect(res2.body).toEqual({
            success: true,
            currentPage: 2,
            totalItems: expect.any(Number),
            totalPages: expect.any(Number),
            attributes: expect.any(Array),
        });

        const attributes2 = res2.body.attributes;
        for (let i = 0; i < attributes2.length - 1; i++) {
            expect(attributes2[i].name < attributes2[i + 1].name).toBe(true);
        }

        expect(
            attributes[attributes.length - 1].name < attributes2[0].name
        ).toBe(true);
    });

    it("should return 401 if token is not provided", async () => {
        const res = await request(app).get("/api/v2/admin/attributes");

        assertTokenNotProvided(res);
    });

    it("should return 401 if token is invalid", async () => {
        const res = await request(app)
            .get("/api/v2/admin/attributes")
            .set("Authorization", `Bearer invalid`);

        assertTokenInvalid(res);
    });

    it("should return 401 if user is not an admin", async () => {
        const res = await request(app)
            .get("/api/v2/admin/attributes")
            .set("Authorization", `Bearer ${accessTokenUser}`);

        assertNotAnAdmin(res);
    });
});
