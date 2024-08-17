import { jwt } from "../../config/auth.config.js";
import User from "../../models/user/user.model.js";
import { createHash } from "crypto";

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
}

export default new TokenService();
