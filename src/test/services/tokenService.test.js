import { TokenService } from "../../services/tokenService.js";
import { jwt } from "../../config/authConfig.js";
import seedData from "../setup.js";
import bcrypt from "bcryptjs";
import { User } from "../../models/userModel.js";

beforeEach(async () => {
    await seedData();
});

describe("TokenService.signToken + TokenService.decodeToken", () => {
    test("should return a valid token", async () => {
        const payload = { id: "1" };
        const token = await TokenService.signToken(payload);
        const decoded = await TokenService.decodeToken(token);

        expect(decoded.id).toEqual("1");
    });

    test("should throw an error if token is invalid", async () => {
        const payload = { id: "1" };
        const token = await TokenService.signToken(payload);
        const invalidToken = token.slice(0, -1) + "a";

        try {
            await TokenService.decodeToken(invalidToken);
        } catch (err) {
            expect(err).toBeInstanceOf(jwt.JsonWebTokenError);
        }
    });
});

describe("TokenService.createRefreshToken", () => {
    test("should create a new refresh token", async () => {
        const userId = "1";
        const token = await TokenService.createRefreshToken(userId);

        const refreshToken = (await User.findByPk(userId)).refreshToken;

        expect(await bcrypt.compare(token, refreshToken)).toBeTruthy();
    });

    test("should update the refresh token if it already exists", async () => {
        const userId = "1";
        const token = await TokenService.createRefreshToken(userId);

        setTimeout(async () => {
            const newToken = await TokenService.createRefreshToken(userId);
            expect(token).not.toEqual(newToken);
        }, 2000);
    });
});

describe("TokenService.decodeToken", () => {
    test("should return a valid decoded token", async () => {
        const userId = "1";
        const token = await TokenService.signToken({ id: userId });
        const decoded = await TokenService.decodeToken(token);

        expect(decoded.id).toEqual(userId);
        expect(decoded.exp).toEqual(
            Math.floor(new Date().getTime() / 1000 + jwt.TOKEN_LIFE)
        );
    });

    test("should throw an error if token is invalid", async () => {
        const userId = "1";
        const token = await TokenService.signToken({ id: userId });
        const invalidToken = token.slice(0, -1) + "a";

        try {
            await TokenService.decodeToken(invalidToken);
        } catch (err) {
            expect(err).toBeInstanceOf(jwt.JsonWebTokenError);
        }
    });

    test("should throw token expire error if token is expired", async () => {
        const userId = "1";
        const payload = { id: userId };

        const expiredToken = await jwt.sign(payload, jwt.SECRET_KEY, {
            algorithm: jwt.ALGORITHM,
            expiresIn: "1",
        });
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            await TokenService.decodeToken(expiredToken);
        } catch (err) {
            expect(err).toBeInstanceOf(jwt.TokenExpiredError);
        }
    });
});

describe("TokenService.decodeRefreshToken", () => {
    test("should return a valid decoded token", async () => {
        const userId = "1";
        const token = await TokenService.createRefreshToken(userId);
        const decoded = await TokenService.decodeRefreshToken(token);

        expect(decoded.id).toEqual(userId);
        expect(decoded.exp).toEqual(
            Math.floor(new Date().getTime() / 1000 + jwt.REFRESH_TOKEN_LIFE)
        );
    });

    test("should throw an error if token is invalid", async () => {
        const userId = "1";
        const token = await TokenService.createRefreshToken(userId);
        const invalidToken = token.slice(0, -1) + "a";

        try {
            await TokenService.decodeRefreshToken(invalidToken);
        } catch (err) {
            expect(err).toBeInstanceOf(jwt.JsonWebTokenError);
        }
    });

    test("should throw token expire error if token is expired", async () => {
        const userId = "1";
        const payload = { id: userId };

        const expiredToken = await jwt.sign(payload, jwt.SECRET_REFRESH_KEY, {
            algorithm: jwt.ALGORITHM,
            expiresIn: "1",
        });
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            await TokenService.decodeRefreshToken(expiredToken);
        } catch (err) {
            console.log(err);
            expect(err).toBeInstanceOf(jwt.TokenExpiredError);
        }
    });
});
