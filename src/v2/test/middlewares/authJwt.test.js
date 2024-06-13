import seedData from "../../seedData.js";
import * as authJwt from "../../middlewares/authJwt.js";
import { jwt } from "../../config/auth.config.js";
import { jest } from "@jest/globals";
import tokenService from "../../services/token.service.js";

beforeAll(async () => {
    await seedData();
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

            json({ success, error }) {
                expect(success).toEqual(false);
                expect(error).toEqual("Token not found");
            },
        };
        const next = jest.fn();

        await authJwt.verifyToken(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(req.header).toHaveBeenCalledWith("Authorization");
        expect(req.user).toBeUndefined();
    });

    test("Should deny access if token is invalid", async () => {
        const res = {
            json({ success, error }) {
                expect(success).toEqual(false);
                expect(error).toEqual("Token invalid");
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
        expect(next).not.toHaveBeenCalled();
        expect(req.header).toHaveBeenCalledWith("Authorization");
        expect(req.user).toBeUndefined();
    });

    test("should deny access if token is expired", async () => {
        const res = {
            json({ success, error }) {
                expect(success).toEqual(false);
                expect(error).toEqual("Token expired");
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
        expect(next).not.toHaveBeenCalled();
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
            .mockReturnValueOnce({
                id: "1",
            });

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

            json({ success, error }) {
                expect(success).toEqual(false);
                expect(error).toEqual("Token not found");
            },
        };
        const next = jest.fn();

        await authJwt.verifyRefreshToken(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(req.user).toBeUndefined();
    });

    test("should deny access if refresh token is invalid", async () => {
        const res = {
            json({ success, error }) {
                expect(success).toEqual(false);
                expect(error).toEqual("Token invalid");
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
        expect(next).not.toHaveBeenCalled();
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

            json({ success, error }) {
                expect(success).toEqual(false);
                expect(error).toEqual(
                    "Not an admin. Cannot retrieve administrative data"
                );
            },
        };
        const next = jest.fn();

        await authJwt.isAdmin(req, res, next);

        expect(next).not.toHaveBeenCalled();
    });
});
