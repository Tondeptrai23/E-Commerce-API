import { jwt } from "../config/auth.config.js";
import { User } from "../models/userOrder/user.model.js";
import bcrypt from "bcryptjs";

class TokenService {
    async #signRefreshToken(payload) {
        const token = await jwt.sign(payload, jwt.SECRET_REFRESH_KEY, {
            algorithm: jwt.ALGORITHM,
            allowInsecureKeySizes: true,
            expiresIn: jwt.REFRESH_TOKEN_LIFE,
        });

        return token;
    }

    async createRefreshToken(user) {
        const newToken = await this.#signRefreshToken({ id: user.userID });
        const salt = await bcrypt.genSalt(8);
        const hashedToken = await bcrypt.hash(newToken, salt);

        user.refreshToken = hashedToken;
        await user.save();

        return newToken;
    }

    async signToken(payload) {
        const token = await jwt.sign(payload, jwt.SECRET_KEY, {
            algorithm: jwt.ALGORITHM,
            allowInsecureKeySizes: true,
            expiresIn: jwt.TOKEN_LIFE,
        });

        return token;
    }

    async decodeToken(token) {
        const decoded = await jwt.verify(token, jwt.SECRET_KEY, {
            algorithm: jwt.ALGORITHM,
        });

        return decoded;
    }

    async decodeRefreshToken(token) {
        const decoded = await jwt.verify(token, jwt.SECRET_REFRESH_KEY, {
            algorithm: jwt.ALGORITHM,
        });

        const userID = decoded.id;
        const refreshToken = (await User.findByPk(userID)).refreshToken;
        const isCorrectToken = await bcrypt.compare(token, refreshToken);

        if (!isCorrectToken) {
            throw new jwt.JsonWebTokenError("Token invalid");
        }

        return decoded;
    }
}

export default new TokenService();
