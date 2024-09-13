import jwt from "jsonwebtoken";
import { promisify } from "util";
import { jwtConfig } from "./config.js";

const sign = promisify(jwt.sign).bind(jwt);
const verify = promisify(jwt.verify).bind(jwt);

const newJWT = {
    sign: sign,
    verify: verify,

    SECRET_KEY: jwtConfig.SECRET_KEY,
    TOKEN_LIFE: jwtConfig.TOKEN_LIFE,
    SECRET_REFRESH_KEY: jwtConfig.SECRET_REFRESH_KEY,
    REFRESH_TOKEN_LIFE: jwtConfig.REFRESH_TOKEN_LIFE,
    ALGORITHM: "HS256",

    TokenExpiredError: jwt.TokenExpiredError,
    JsonWebTokenError: jwt.JsonWebTokenError,
};

export { newJWT as jwt };
