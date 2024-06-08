import { jest } from "@jest/globals";
import { AuthController } from "../../controllers/AuthController.js";
import seedData from "../setup.js";
import { User } from "../../models/userModel.js";
import { db } from "../../models/index.js";
import { jwt } from "../../config/authConfig.js";
import { UserService } from "../../services/userService.js";

beforeEach(async () => {
    await seedData();
});

afterAll(async () => {
    await db.close();
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

        // Mocking jwt.sign, UserSerivce.verifyUser function
        const sign = jest.spyOn(jwt, "sign").mockReturnValueOnce("token");
        const verifyUser = jest
            .spyOn(UserService, "verifyUser")
            .mockResolvedValueOnce(true);

        const res = {
            status(responseStatus) {
                expect(responseStatus).toEqual(200);
                return this;
            },
            json({ success, accessToken, user }) {
                expect(success).toEqual(true);
                expect(accessToken).toEqual("token");
                expect(user.userId).toEqual("1");
            },
        };

        // Act
        await AuthController.signIn(req, res);

        // Assert
        expect(sign).toHaveBeenCalledWith({ id: "1" }, jwt.secretKey, {
            algorithm: jwt.algorithm,
            allowInsecureKeySizes: true,
            expiresIn: 120000,
        });
        expect(verifyUser).toHaveBeenCalledWith(
            req.body.password,
            req.user.password
        );
    });
});
