import seedData from "../setup.js";
import * as authJwt from "../../../middlewares/authJwt.js";
import { jwt } from "../../../config/authConfig.js";
import { db } from "../../../models/index.js";
import { jest } from "@jest/globals";

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
        const verify = jest.spyOn(jwt, "verify").mockReturnValueOnce({
            id: "1",
        });

        await authJwt.verifyToken(req, res, next);

        expect(req.header).toHaveBeenCalledWith("Authorization");
        expect(verify).toHaveBeenCalledWith("token", jwt.secretKey, {
            algorithms: jwt.algorithm,
        });
        expect(req.user.id).toEqual("1");
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
                expect(error).toEqual("Token not found.");
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
                expect(error).toEqual("Token invalid.");
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

        const verify = jest
            .spyOn(jwt, "verify")
            .mockRejectedValueOnce(new jwt.JsonWebTokenError());
        await authJwt.verifyToken(req, res, next);

        expect(verify).toHaveBeenCalledWith("token", jwt.secretKey, {
            algorithms: jwt.algorithm,
        });
        expect(next).not.toHaveBeenCalled();
        expect(req.header).toHaveBeenCalledWith("Authorization");
        expect(req.user).toBeUndefined();
    });
});
