import { jest } from "@jest/globals";
import { AuthController } from "../../controllers/authController.js";
import seedData from "../setup.js";
import { User } from "../../models/userModel.js";
import { UserService } from "../../services/userService.js";
import { TokenService } from "../../services/tokenService.js";

beforeEach(async () => {
    await seedData();
});

describe("AuthController.signUp", () => {
    test("should create a new user and return a success response", async () => {
        // Arrange
        const req = {
            body: {
                email: "something@example2.com",
                username: "testuser",
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
        await AuthController.signUp(req, res);
    });
});

describe("AuthController.signIn", () => {
    test("should return a success response for correct password", async () => {
        // Arrange
        const req = {
            user: await User.findOne({ where: { id: "1" } }),
            body: {
                password: "password1",
            },
        };

        // Mocking TokenService, UserSerivce.verifyUser function
        const signToken = jest
            .spyOn(TokenService, "signToken")
            .mockReturnValueOnce("token");
        const createRefreshToken = jest
            .spyOn(TokenService, "createRefreshToken")
            .mockReturnValueOnce("refresh_token");
        const verifyUser = jest
            .spyOn(UserService, "verifyUser")
            .mockResolvedValueOnce(true);

        const res = {
            status(responseStatus) {
                expect(responseStatus).toEqual(200);
                return this;
            },
            json({ success, accessToken, refreshToken, user }) {
                expect(success).toEqual(true);
                expect(accessToken).toEqual("token");
                expect(refreshToken).toEqual("refresh_token");
                expect(user.userId).toEqual("1");
            },
        };

        // Act
        await AuthController.signIn(req, res);

        // Assert
        expect(signToken).toHaveBeenCalledWith({
            id: req.user.id,
        });
        expect(createRefreshToken).toHaveBeenCalledWith(req.user.id);
        expect(verifyUser).toHaveBeenCalledWith(
            req.body.password,
            req.user.password
        );
    });

    test("should return a 400 response for incorrect password", async () => {
        // Arrange
        const req = {
            user: await User.findOne({ where: { id: "1" } }),
            body: {
                password: "password1",
            },
        };

        // Mocking jwt.sign, UserSerivce.verifyUser function
        const verifyUser = jest
            .spyOn(UserService, "verifyUser")
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
        await AuthController.signIn(req, res);

        // Assert
        expect(verifyUser).toHaveBeenCalledWith(
            req.body.password,
            req.user.password
        );
    });
});

describe("AuthController.refresh", () => {
    test("should return a new access token and refresh token", async () => {
        // Arrange
        const req = {
            user: await User.findOne({ where: { id: "1" } }),
        };

        // Mocking TokenService.signToken function
        const signToken = jest
            .spyOn(TokenService, "signToken")
            .mockReturnValueOnce("new_access_token");

        const res = {
            status(responseStatus) {
                expect(responseStatus).toEqual(201);
                return this;
            },
            json({ success, accessToken }) {
                expect(success).toEqual(true);
                expect(accessToken).toEqual("new_access_token");
            },
        };

        // Act
        await AuthController.refresh(req, res);

        // Assert
        expect(signToken).toHaveBeenCalledWith({ id: req.user.id });
    });
});

describe("AuthController.resetToken", () => {
    test("should return a new refresh token", async () => {
        // Arrange
        const req = {
            user: await User.findOne({ where: { id: "1" } }),
        };

        // Mocking TokenService.verifyResetToken function
        const createRefreshToken = jest
            .spyOn(TokenService, "createRefreshToken")
            .mockReturnValueOnce("new_refresh_token");
        // Mocking TokenService.signToken function
        const signToken = jest
            .spyOn(TokenService, "signToken")
            .mockReturnValueOnce("new_access_token");

        const res = {
            status(responseStatus) {
                expect(responseStatus).toEqual(200);
                return this;
            },
            json({ success, refreshToken, accessToken }) {
                expect(success).toEqual(true);
                expect(refreshToken).toEqual("new_refresh_token");
                expect(accessToken).toEqual("new_access_token");
            },
        };

        // Act
        await AuthController.resetToken(req, res);

        // Assert
        expect(createRefreshToken).toHaveBeenCalledWith(req.user.id);
        expect(signToken).toHaveBeenCalledWith({ id: req.user.id });
    });
});
