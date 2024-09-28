import { jwt } from "../../config/auth.config.js";
import User from "../../models/user/user.model.js";
import { createHash } from "crypto";
import VerifyRequest from "../../models/user/verifyRequest.model.js";
import { BadRequestError } from "../../utils/error.js";
import { randomBytes } from "crypto";

/**
 * Service for handling tokens.
 */
class TokenService {
    /**
     * Signs a refresh token with the given payload.
     *
     * @param {Object} payload - The payload to be signed.
     * @returns {Promise<String>} The signed refresh token.
     * @private
     */
    async #signRefreshToken(payload) {
        const token = await jwt.sign(payload, jwt.SECRET_REFRESH_KEY, {
            algorithm: jwt.ALGORITHM,
            allowInsecureKeySizes: true,
            expiresIn: jwt.REFRESH_TOKEN_LIFE,
        });

        return token;
    }

    /**
     * Creates a new refresh token for the given user.
     * And stores the hashed token in the database.
     *
     * @param {User} user - The user model instance.
     * @returns {Promise<tring>} The new refresh token.
     */
    async createRefreshToken(user) {
        const newToken = await this.#signRefreshToken({ id: user.userID });
        const hashedToken = createHash("sha256").update(newToken).digest("hex");

        user.refreshToken = hashedToken;
        await user.save();

        return newToken;
    }

    /**
     * Signs a token with the given payload.
     *
     * @param {Object} payload - The payload to be signed.
     * @returns {Promise<String>} The signed token.
     */
    async signToken(payload) {
        const token = await jwt.sign(payload, jwt.SECRET_KEY, {
            algorithm: jwt.ALGORITHM,
            allowInsecureKeySizes: true,
            expiresIn: jwt.TOKEN_LIFE,
        });

        return token;
    }

    /**
     * Decodes a token and returns the decoded payload.
     *
     * @param {String} token - The token to be decoded.
     * @returns {Promise<Object>} The decoded payload.
     */
    async decodeToken(token) {
        const decoded = await jwt.verify(token, jwt.SECRET_KEY, {
            algorithm: jwt.ALGORITHM,
        });

        return decoded;
    }

    /**
     * Decodes a refresh token and returns the decoded payload.
     * Also checks if the token is valid.
     *
     * @param {String} token - The refresh token to be decoded.
     * @returns {Promise<User>} The user object in the payload.
     * @throws {JsonWebTokenError} If the token is invalid.
     * @throws {ResourceNotFoundError} If the user is not found.
     * @throws {TokenExpiredError} If the token is expired.
     */
    async decodeRefreshToken(token) {
        const decoded = await jwt.verify(token, jwt.SECRET_REFRESH_KEY, {
            algorithm: jwt.ALGORITHM,
        });

        const userID = decoded.id;
        const user = await User.findByPk(userID);
        if (!user) {
            throw new ResourceNotFoundError("User not found");
        }

        // Verify token
        const refreshToken = user.refreshToken;
        const hashedToken = createHash("sha256").update(token).digest("hex");
        const isCorrectToken = hashedToken === refreshToken;
        if (!isCorrectToken) {
            throw new jwt.JsonWebTokenError("Token invalid");
        }

        return user;
    }
    /**
     * Create a reset password code
     *
     * @param {String} userID The userID
     * @returns {Promise<String>} The reset password code
     */
    async createResetPasswordCode(userID) {
        const request = await VerifyRequest.findOne({
            where: {
                userID: userID,
                type: "resetPassword",
            },
        });

        const EXPIRES_IN = 15; // 15 minutes
        if (request) {
            request.code = generate6DigitCode();
            request.expiredAt = generateExpiresTime(EXPIRES_IN);
            await request.save();
            return request.code;
        } else {
            const newRequest = await VerifyRequest.create({
                code: generate6DigitCode(),
                expiredAt: generateExpiresTime(EXPIRES_IN),
                userID: userID,
                type: "resetPassword",
            });

            return newRequest.code;
        }
    }

    /**
     * Create a verification code
     *
     * @param {String} userID The user
     * @returns {Promise<User>} The user
     */
    async createVerificationCode(userID) {
        const request = await VerifyRequest.findOne({
            where: {
                userID: userID,
                type: "verifyEmail",
            },
        });

        const EXPIRES_IN = 15; // 15 minutes
        if (request) {
            request.code = generate6DigitCode();
            request.expiredAt = generateExpiresTime(EXPIRES_IN);
            await request.save();
            return request.code;
        } else {
            const newRequest = await VerifyRequest.create({
                code: generate6DigitCode(),
                expiredAt: generateExpiresTime(EXPIRES_IN),
                userID: userID,
                type: "verifyEmail",
            });

            return newRequest.code;
        }
    }

    /**
     * Create a reset password session token
     *
     * @param {String} userID The userID
     * @returns {Promise<String>} The reset password session token
     */
    async createResetPasswordSessionToken(userID) {
        const request = await VerifyRequest.findOne({
            where: {
                userID: userID,
                type: "resetPassword",
            },
        });

        if (!request) {
            return;
        }

        const token = generateCode();
        request.code = token;
        request.expiredAt = generateExpiresTime(10);
        await request.save();

        return token;
    }

    /**
     * Verify the reset password code
     *
     * @param {String} userID The userID
     * @param {String} code The reset password code
     * @returns {Promise<Boolean>} The result
     */
    async verifyResetPasswordCode(userID, code) {
        const request = await VerifyRequest.findOne({
            where: {
                userID: userID,
                code: code,
                type: "resetPassword",
            },
        });

        if (!request) {
            throw new BadRequestError("Invalid reset password code");
        }

        if (request.expiredAt < Date.now()) {
            throw new BadRequestError("Reset password code expired");
        }

        return true;
    }
}

const generate6DigitCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateCode = () => {
    return randomBytes(20).toString("hex");
};

const generateExpiresTime = (minutes) => {
    return Date.now() + minutes * 60 * 1000;
};

export default new TokenService();
