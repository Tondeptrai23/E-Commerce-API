import tokenService from "../../../../services/auth/token.service.js";
import { jwt } from "../../../../config/auth.config.js";
import User from "../../../../models/user/user.model.js";
import { createHash } from "crypto";
import seedData from "../../../../seedData.js";
import VerifyRequest from "../../../../models/user/verifyRequest.model.js";
import {
    BadRequestError,
    GoneError,
    ResourceNotFoundError,
} from "../../../../utils/error.js";

beforeAll(async () => {
    await seedData();
}, 15000);

describe("Token Service", () => {
    describe("signToken + decodeToken", () => {
        test("should return a valid token", async () => {
            const payload = { id: "1" };
            const token = await tokenService.signToken(payload);
            const decoded = await tokenService.decodeToken(token);

            expect(decoded.id).toEqual("1");
        });

        test("should throw an error if token is invalid", async () => {
            const payload = { id: "1" };
            const token = await tokenService.signToken(payload);
            const invalidToken = token.slice(0, -1) + "a";

            try {
                await tokenService.decodeToken(invalidToken);
            } catch (err) {
                expect(err).toBeInstanceOf(jwt.JsonWebTokenError);
            }
        });
    });

    describe("createRefreshToken", () => {
        test("should create a new refresh token", async () => {
            const user = await User.findByPk("1");
            const token = await tokenService.createRefreshToken(user);

            const refreshToken = user.refreshToken;
            const hashedToken = createHash("sha256")
                .update(token)
                .digest("hex");

            expect(refreshToken).toEqual(hashedToken);
        });

        test("should update the refresh token if it already exists", async () => {
            const user = await User.findByPk("1");
            const token = await tokenService.createRefreshToken(user);

            setTimeout(async () => {
                const newToken = await tokenService.createRefreshToken(user);
                expect(token).not.toEqual(newToken);
            }, 2000);
        });
    });

    describe("decodeToken", () => {
        test("should return a valid decoded token", async () => {
            const userID = "1";
            const token = await tokenService.signToken({ id: userID });
            const decoded = await tokenService.decodeToken(token);

            expect(decoded.id).toEqual(userID);
            expect(decoded.exp).toEqual(
                Math.floor(new Date().getTime() / 1000 + jwt.TOKEN_LIFE)
            );
        });

        test("should throw an error if token is invalid", async () => {
            const userID = "1";
            const token = await tokenService.signToken({ id: userID });
            const invalidToken = token.slice(0, -1) + "a";

            try {
                await tokenService.decodeToken(invalidToken);
            } catch (err) {
                expect(err).toBeInstanceOf(jwt.JsonWebTokenError);
            }
        });

        test("should throw token expire error if token is expired", async () => {
            const userID = "1";
            const payload = { id: userID };

            const expiredToken = await jwt.sign(payload, jwt.SECRET_KEY, {
                algorithm: jwt.ALGORITHM,
                expiresIn: "1",
            });
            try {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                await tokenService.decodeToken(expiredToken);
            } catch (err) {
                expect(err).toBeInstanceOf(jwt.TokenExpiredError);
            }
        });
    });

    describe("decodeRefreshToken", () => {
        test("should return a valid decoded token", async () => {
            const userID = "1";
            const user = await User.findByPk(userID);
            const token = await tokenService.createRefreshToken(user);
            const decoded = await tokenService.decodeRefreshToken(token);

            expect(decoded.userID).toEqual(user.userID);
        });

        test("should throw an error if token is invalid", async () => {
            const user = await User.findByPk("1");
            const token = await tokenService.createRefreshToken(user);
            const invalidToken = token.slice(0, -1) + "a";

            try {
                await tokenService.decodeRefreshToken(invalidToken);
            } catch (err) {
                expect(err).toBeInstanceOf(jwt.JsonWebTokenError);
            }
        });

        test("should throw token expire error if token is expired", async () => {
            const userID = "1";
            const payload = { id: userID };

            const expiredToken = await jwt.sign(
                payload,
                jwt.SECRET_REFRESH_KEY,
                {
                    algorithm: jwt.ALGORITHM,
                    expiresIn: "1",
                }
            );
            try {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                await tokenService.decodeRefreshToken(expiredToken);
            } catch (err) {
                expect(err).toBeInstanceOf(jwt.TokenExpiredError);
            }
        });
    });

    describe("createResetPasswordCode", () => {
        beforeAll(async () => {
            await VerifyRequest.destroy({
                where: {
                    type: "resetPassword",
                },
            });
        });

        test("should create a new reset password code", async () => {
            const user = await User.findByPk("1");
            const code = await tokenService.createResetPasswordCode(
                user.userID
            );

            expect(code).not.toBeNull();
            const request = await VerifyRequest.findOne({
                where: {
                    userID: user.userID,
                    code: code,
                },
            });

            expect(request).not.toBeNull();
            expect(request.type).toEqual("resetPassword");
        });

        test("should update the reset password code if it already exists", async () => {
            const user = await User.findByPk("1");
            const code = await tokenService.createResetPasswordCode(
                user.userID
            );

            setTimeout(async () => {
                const newCode = await tokenService.createResetPasswordCode(
                    user.userID
                );
                expect(code).not.toEqual(newCode);
            }, 200);
        });
    });

    describe("createResetPasswordSessionToken", () => {
        beforeAll(async () => {
            await VerifyRequest.destroy({
                where: {
                    type: "resetPassword",
                },
            });
        });

        test("should do nothing if the reset password code is not found", async () => {
            const user = await User.findByPk("1");
            await tokenService.createResetPasswordSessionToken(user.userID);

            const request = await VerifyRequest.findOne({
                where: {
                    userID: user.userID,
                    type: "resetPassword",
                },
            });

            expect(request).toBeNull();
        });

        test("should create a new reset password session token", async () => {
            const user = await User.findByPk("1");
            const code = await tokenService.createResetPasswordCode(
                user.userID
            );

            const sessionToken =
                await tokenService.createResetPasswordSessionToken(user.userID);

            expect(sessionToken).not.toBeNull();
            const request = await VerifyRequest.findOne({
                where: {
                    userID: user.userID,
                    type: "resetPassword",
                },
            });

            expect(request.code).not.toEqual(code);
        });
    });

    describe("verifyResetPasswordCode", () => {
        beforeAll(async () => {
            await VerifyRequest.destroy({
                where: {
                    type: "resetPassword",
                },
            });
        });

        test("should verify the reset password code", async () => {
            const user = await User.findByPk("1");
            await VerifyRequest.create({
                userID: user.userID,
                code: "123456",
                type: "resetPassword",
                expiredAt: new Date().getTime() + 10000,
            });

            const result = await tokenService.verifyResetPasswordCode(
                user.userID,
                "123456"
            );

            expect(result).toBe(true);
        });

        test("should throw an error if the code is invalid", async () => {
            const user = await User.findByPk("1");
            const code = "invalid";

            try {
                await tokenService.verifyResetPasswordCode(user.userID, code);
            } catch (err) {
                expect(err).toBeInstanceOf(ResourceNotFoundError);
            }
        });

        test("should throw an error if the code is expired", async () => {
            const user = await User.findByPk("1");
            await VerifyRequest.destroy({
                where: {
                    userID: user.userID,
                    type: "resetPassword",
                },
            });

            await VerifyRequest.create({
                userID: user.userID,
                code: "123456",
                type: "resetPassword",
                expiredAt: new Date() - 10000,
            });

            try {
                await tokenService.verifyResetPasswordCode(
                    user.userID,
                    "123456"
                );
            } catch (err) {
                expect(err).toBeInstanceOf(GoneError);
            }
        });
    });
});
