import seedData from "../../../seedData.js";
import * as authJwt from "../../../middlewares/authJwt.middleware.js";
import { jwt } from "../../../config/auth.config.js";
import { jest } from "@jest/globals";
import tokenService from "../../../services/auth/token.service.js";
import { db } from "../../../models/index.model.js";

beforeAll(async () => {
    await seedData();
});

afterAll(async () => {
    await db.close();
});

describe("authJwt.verifyToken", () => {
    test("should call next() if token is valid", async () => {
        const req = {
            header: jest.fn().mockReturnValue("Bearer token"),
        };
        const res = {};
        const next = jest.fn();

        // Mocking the jwt.verify function
        const decodeToken = jest
            .spyOn(tokenService, "decodeToken")
            .mockReturnValueOnce({ id: "1" });

        await authJwt.verifyToken(req, res, next);

        expect(req.header).toHaveBeenCalledWith("Authorization");
        expect(decodeToken).toHaveBeenCalledWith("token");
        expect(req.user.userID).toEqual("1");
        expect(next).toHaveBeenCalled();
    });

    test("should return 401 if token is missing", async () => {
        const req = {
            header: jest.fn().mockReturnValue(""),
        };
        const res = {
            status(responseStatus) {
                expect(responseStatus).toEqual(401);
                return this;
            },

            json({ success, errors }) {
                expect(success).toEqual(false);
                expect(errors).toHaveLength(1);
                expect(errors[0].error).toEqual("Unauthorized");
                expect(errors[0].message).toEqual("Token not found");
            },
        };
        const next = jest.fn();

        await authJwt.verifyToken(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(req.header).toHaveBeenCalledWith("Authorization");
        expect(req.user).toBeUndefined();
    });

    test("Should deny access if token is invalid", async () => {
        const res = {
            json({ success, errors }) {
                expect(success).toEqual(false);
                expect(errors).toHaveLength(1);
                expect(errors[0].error).toEqual("TokenInvalid");
                expect(errors[0].message).toEqual("Token invalid");
            },
            status(responseStatus) {
                expect(responseStatus).toEqual(401);
                return this;
            },
        };
        const req = {
            header: jest.fn().mockReturnValue("Bearer token"),
        };
        const next = jest.fn();

        const decodeToken = jest
            .spyOn(tokenService, "decodeToken")
            .mockRejectedValueOnce(new jwt.JsonWebTokenError());

        await authJwt.verifyToken(req, res, next);

        expect(decodeToken).toHaveBeenCalledWith("token");
        expect(next).toHaveBeenCalled();
        expect(req.header).toHaveBeenCalledWith("Authorization");
        expect(req.user).toBeUndefined();
    });

    test("should deny access if token is expired", async () => {
        const res = {
            json({ success, errors }) {
                expect(success).toEqual(false);
                expect(errors).toHaveLength(1);
                expect(errors[0].error).toEqual("TokenExpired");
                expect(errors[0].message).toEqual("Token expired");
            },
            status(responseStatus) {
                expect(responseStatus).toEqual(401);
                return this;
            },
        };
        const req = {
            header: jest.fn().mockReturnValue("Bearer token"),
        };
        const next = jest.fn();

        const decodeToken = jest
            .spyOn(tokenService, "decodeToken")
            .mockRejectedValueOnce(new jwt.TokenExpiredError());

        await authJwt.verifyToken(req, res, next);

        expect(decodeToken).toHaveBeenCalledWith("token");
        expect(next).toHaveBeenCalled();
        expect(req.header).toHaveBeenCalledWith("Authorization");
        expect(req.user).toBeUndefined();
    });
});

describe("authJwt.verifyRefreshToken", () => {
    test("should call next() if refresh token is valid", async () => {
        const req = {
            body: {
                token: "refresh_token",
            },
        };
        const res = {};
        const next = jest.fn();

        // Mocking the TokenService.verifyRefreshToken function
        const decodeRefreshToken = jest
            .spyOn(tokenService, "decodeRefreshToken")
            .mockReturnValueOnce({ userID: "1" });

        await authJwt.verifyRefreshToken(req, res, next);

        expect(decodeRefreshToken).toHaveBeenCalledWith(req.body.token);
        expect(req.user.userID).toEqual("1");
        expect(next).toHaveBeenCalled();
    });

    test("should return 401 if refresh token is missing", async () => {
        const req = {
            body: {},
        };
        const res = {
            status(responseStatus) {
                expect(responseStatus).toEqual(401);
                return this;
            },

            json({ success, errors }) {
                expect(success).toEqual(false);
                expect(errors).toHaveLength(1);
                expect(errors[0].error).toEqual("Unauthorized");
                expect(errors[0].message).toEqual("Token not found");
            },
        };
        const next = jest.fn();

        await authJwt.verifyRefreshToken(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(req.user).toBeUndefined();
    });

    test("should deny access if refresh token is invalid", async () => {
        const res = {
            json({ success, errors }) {
                expect(success).toEqual(false);
                expect(errors).toHaveLength(1);
                expect(errors[0].error).toEqual("TokenInvalid");
                expect(errors[0].message).toEqual("Token invalid");
            },
            status(responseStatus) {
                expect(responseStatus).toEqual(401);
                return this;
            },
        };
        const req = {
            body: {
                token: "refresh_token",
            },
        };
        const next = jest.fn();
        const decodeRefreshToken = jest
            .spyOn(tokenService, "decodeRefreshToken")
            .mockRejectedValueOnce(new jwt.JsonWebTokenError());

        await authJwt.verifyRefreshToken(req, res, next);

        expect(decodeRefreshToken).toHaveBeenCalledWith("refresh_token");
        expect(next).toHaveBeenCalled();
        expect(req.user).toBeUndefined();
    });
});

describe("authJwt.isAdmin", () => {
    test("should call next() if user is an admin", async () => {
        const req = {
            user: {
                role: "admin",
            },
            params: {},
        };
        const res = {};
        const next = jest.fn();

        await authJwt.isAdmin(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(req.admin).toEqual(req.user);
    });

    test("should return 403 if user is not an admin", async () => {
        const req = {
            user: {
                role: "user",
            },
        };
        const res = {
            status(responseStatus) {
                expect(responseStatus).toEqual(403);
                return this;
            },

            json({ success, errors }) {
                expect(success).toEqual(false);
                expect(errors).toHaveLength(1);
                expect(errors[0].error).toEqual("Forbidden");
                expect(errors[0].message).toEqual(
                    "Not an admin. Cannot retrieve administrative data"
                );
            },
        };
        const next = jest.fn();

        await authJwt.isAdmin(req, res, next);

        expect(next).toHaveBeenCalled();
    });
});

describe("authJwt.checkEmailExistsForSignIn", () => {
    test("should call next() if email exists", async () => {
        const req = { body: { email: "user1@gmail.com" } };
        const res = {};
        const next = jest.fn();

        await authJwt.checkEmailExistsForSignIn(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    test("should return 404 if email does not exist", async () => {
        const req = { body: { email: "nonexistent@example.com" } };
        const res = {
            status(responseStatus) {
                expect(responseStatus).toEqual(404);
                return this;
            },

            json({ success, errors }) {
                expect(success).toEqual(false);
                expect(errors).toHaveLength(1);
                expect(errors[0].error).toEqual("NotFound");
                expect(errors[0].message).toEqual("Email not found");
            },
        };
        const next = jest.fn();

        await authJwt.checkEmailExistsForSignIn(req, res, next);

        expect(next).toHaveBeenCalled();
    });
});
