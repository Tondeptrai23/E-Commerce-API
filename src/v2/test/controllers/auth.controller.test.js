import { jest } from "@jest/globals";
import authController from "../../controllers/auth/auth.controller.js";
import seedData from "../../seedData.js";
import User from "../../models/user/user.model.js";
import userService from "../../services/auth/user.service.js";
import tokenService from "../../services/auth/token.service.js";

beforeAll(async () => {
    await seedData();
}, 15000);

describe("authController.signup", () => {
    test("should create a new user and return a success response", async () => {
        // Arrange
        const req = {
            body: {
                email: "something@example2.com",
                name: "testuser",
                password: "password123",
            },
        };
        const res = {
            status(responseStatus) {
                expect(responseStatus).toEqual(201);
                return this;
            },
            json({ success }) {
                expect(success).toEqual(true);
            },
        };

        // Act
        await authController.signup(req, res);
    });
});

describe("authController.signin", () => {
    test("should return a success response for correct password", async () => {
        // Arrange
        const req = {
            user: await User.findOne({ where: { userID: "1" } }),
            body: {
                password: "password1",
            },
        };

        // Mocking tokenService, UserSerivce.verifyUser function
        const signToken = jest
            .spyOn(tokenService, "signToken")
            .mockReturnValueOnce("token");
        const createRefreshToken = jest
            .spyOn(tokenService, "createRefreshToken")
            .mockReturnValueOnce("refresh_token");
        const verifyUser = jest
            .spyOn(userService, "verifyUser")
            .mockResolvedValueOnce(true);

        const res = {
            status(responseStatus) {
                expect(responseStatus).toEqual(200);
                return this;
            },
            json({ success, data }) {
                expect(success).toEqual(true);
                expect(data.accessToken).toEqual("token");
                expect(data.refreshToken).toEqual("refresh_token");
                expect(data.user.userID).toEqual("1");
            },
        };

        // Act
        await authController.signin(req, res);

        // Assert
        expect(signToken).toHaveBeenCalledWith({
            id: req.user.userID,
        });
        expect(createRefreshToken).toHaveBeenCalledWith(req.user);
        expect(verifyUser).toHaveBeenCalledWith(
            req.body.password,
            req.user.password
        );
    });

    test("should return a 400 response for incorrect password", async () => {
        // Arrange
        const req = {
            user: await User.findOne({ where: { userID: "1" } }),
            body: {
                password: "password1",
            },
        };

        // Mocking jwt.sign, UserSerivce.verifyUser function
        const verifyUser = jest
            .spyOn(userService, "verifyUser")
            .mockResolvedValueOnce(false);

        const res = {
            status(responseStatus) {
                expect(responseStatus).toEqual(400);
                return this;
            },
            json({ success, error }) {
                expect(success).toEqual(false);
                expect(error).toEqual("Wrong email/password");
            },
        };

        // Act
        await authController.signin(req, res);

        // Assert
        expect(verifyUser).toHaveBeenCalledWith(
            req.body.password,
            req.user.password
        );
    });
});

describe("authController.refresh", () => {
    test("should return a new access token and refresh token", async () => {
        // Arrange
        const req = {
            user: await User.findOne({ where: { userID: "1" } }),
        };

        // Mocking tokenService.signToken function
        const signToken = jest
            .spyOn(tokenService, "signToken")
            .mockReturnValueOnce("new_access_token");

        const res = {
            status(responseStatus) {
                expect(responseStatus).toEqual(201);
                return this;
            },
            json({ success, data }) {
                expect(success).toEqual(true);
                expect(data.accessToken).toEqual("new_access_token");
            },
        };

        // Act
        await authController.refreshToken(req, res);

        // Assert
        expect(signToken).toHaveBeenCalledWith({ id: req.user.userID });
    });
});

describe("authController.resetRefreshToken", () => {
    test("should return a new refresh token", async () => {
        // Arrange
        const req = {
            user: await User.findOne({ where: { userID: "1" } }),
        };

        // Mocking tokenService.verifyresetRefreshToken function
        const createRefreshToken = jest
            .spyOn(tokenService, "createRefreshToken")
            .mockReturnValueOnce("new_refresh_token");
        // Mocking tokenService.signToken function
        const signToken = jest
            .spyOn(tokenService, "signToken")
            .mockReturnValueOnce("new_access_token");

        const res = {
            status(responseStatus) {
                expect(responseStatus).toEqual(200);
                return this;
            },
            json({ success, data }) {
                expect(success).toEqual(true);
                expect(data.refreshToken).toEqual("new_refresh_token");
                expect(data.accessToken).toEqual("new_access_token");
            },
        };

        // Act
        await authController.resetRefreshToken(req, res);

        // Assert
        expect(createRefreshToken).toHaveBeenCalledWith(req.user);
        expect(signToken).toHaveBeenCalledWith({ id: req.user.userID });
    });
});
