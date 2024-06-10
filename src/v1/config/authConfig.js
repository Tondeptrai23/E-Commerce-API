import "dotenv/config.js";
import jwt from "jsonwebtoken";
import { promisify } from "util";

const sign = promisify(jwt.sign).bind(jwt);
const verify = promisify(jwt.verify).bind(jwt);

const SECRET_KEY =
    process.env.SECRET_KEY || "77f0f3d2dd8330419182cbb3ef65cec181a45aa2";
const TOKEN_LIFE = parseInt(process.env.TOKEN_LIFE) || 3600;

const SECRET_REFRESH_KEY =
    process.env.SECRET_REFRESH_KEY || "634c0c3e0f8f86179e97c9a4f08d4eb3";
const REFRESH_TOKEN_LIFE =
    parseInt(process.env.REFRESH_TOKEN_LIFE) || 86400 * 30;

const ALGORITHM = "HS256";

const newJWT = {
    sign: sign,
    verify: verify,

    SECRET_KEY: SECRET_KEY,
    TOKEN_LIFE: TOKEN_LIFE,
    SECRET_REFRESH_KEY: SECRET_REFRESH_KEY,
    REFRESH_TOKEN_LIFE: REFRESH_TOKEN_LIFE,
    ALGORITHM: ALGORITHM,

    TokenExpiredError: jwt.TokenExpiredError,
    JsonWebTokenError: jwt.JsonWebTokenError,
};

export { newJWT as jwt };
