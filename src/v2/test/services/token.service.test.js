import tokenService from "../../services/token.service.js";
import { jwt } from "../../config/auth.config.js";
import User from "../../models/userOrder/user.model.js";
import { createHash } from "crypto";
import seedData from "../../seedData.js";

beforeAll(async () => {
    await seedData();
}, 15000);

describe("Token Service", () => {
    describe("tokenService.signToken + tokenService.decodeToken", () => {
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

    describe("tokenService.createRefreshToken", () => {
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

    describe("tokenService.decodeToken", () => {
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

    describe("tokenService.decodeRefreshToken", () => {
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
                console.log(err);
                expect(err).toBeInstanceOf(jwt.TokenExpiredError);
            }
        });
    });
});
