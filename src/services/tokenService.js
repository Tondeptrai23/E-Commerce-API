import { jwt } from "../config/authConfig.js";
import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";

class TokenService {
    static #signRefreshToken = async (payload) => {
        const token = await jwt.sign(payload, jwt.SECRET_REFRESH_KEY, {
            algorithm: jwt.ALGORITHM,
            allowInsecureKeySizes: true,
            expiresIn: jwt.REFRESH_TOKEN_LIFE,
        });

        return token;
    };

    static createRefreshToken = async (userId) => {
        const user = await User.findByPk(userId);

        const newToken = await this.#signRefreshToken({ id: userId });
        const salt = await bcrypt.genSalt(8);
        const hashedToken = await bcrypt.hash(newToken, salt);

        user.refreshToken = hashedToken;
        await user.save();

        return newToken;
    };

    static signToken = async (payload) => {
        const token = await jwt.sign(payload, jwt.SECRET_KEY, {
            algorithm: jwt.ALGORITHM,
            allowInsecureKeySizes: true,
            expiresIn: jwt.TOKEN_LIFE,
        });

        return token;
    };

    static decodeToken = async (token) => {
        const decoded = await jwt.verify(token, jwt.SECRET_KEY, {
            algorithm: jwt.ALGORITHM,
        });

        return decoded;
    };

    static decodeRefreshToken = async (token) => {
        const decoded = await jwt.verify(token, jwt.SECRET_REFRESH_KEY, {
            algorithm: jwt.ALGORITHM,
        });

        const userId = decoded.id;
        const refreshToken = (await User.findByPk(userId)).refreshToken;
        const isCorrectToken = await bcrypt.compare(token, refreshToken);

        if (!isCorrectToken) {
            throw new jwt.JsonWebTokenError("Token invalid");
        }

        return decoded;
    };
}

export { TokenService };
