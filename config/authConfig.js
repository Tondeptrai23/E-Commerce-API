import "dotenv/config.js";
import jwt from "jsonwebtoken";
import { promisify } from "util";

const sign = promisify(jwt.sign).bind(jwt);
const verify = promisify(jwt.verify).bind(jwt);

const secretKey =
    process.env.SECRET_KEY || "77f0f3d2dd8330419182cbb3ef65cec181a45aa2";

const algorithm = "HS256";

const newJWT = {
    sign: sign,
    verify: verify,
    secretKey: secretKey,
    algorithm: algorithm,
    TokenExpiredError: jwt.TokenExpiredError,
};

export { newJWT as jwt };
