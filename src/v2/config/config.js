import dotenv from "dotenv";
import path from "path";

dotenv.config({
    path: path.join(process.cwd(), `.env.${process.env.NODE_ENV}`),
});

const paymentConfig = {
    momo: {
        partnerCode: process.env.MOMO_PARTNER_CODE,
        accessKey: process.env.MOMO_ACCESS_KEY,
        secretKey: process.env.MOMO_SECRET_KEY,
        returnUrl: process.env.FRONT_END_URL,
        notifyUrl: process.env.SERVER_URL + "/api/v2/payment/momo/notify",
        orderType: "payWithMethod",
        language: "vi",
    },
    stripe: {
        //
    },
};

const jwtConfig = {
    SECRET_KEY:
        process.env.SECRET_KEY || "77f0f3d2dd8330419182cbb3ef65cec181a45",
    TOKEN_LIFE: parseInt(process.env.TOKEN_LIFE) || 3600,
    SECRET_REFRESH_KEY:
        process.env.SECRET_REFRESH_KEY || "634c0c3e0f8f86179e97c9a4f08d4eb3",
    REFRESH_TOKEN_LIFE: parseInt(process.env.REFRESH_TOKEN_LIFE) || 86400 * 30,
};

const dbConfig = {
    DB_NAME: process.env.DB_NAME,
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_PORT: process.env.DB_PORT,
    DB_TYPE: "mysql",
    DB_HOST: process.env.DB_HOST,
    DB_LOGGING: process.env.NODE_ENV === "development",
};

const serverConfig = {
    PORT: process.env.PORT || 3000,
    SERVER_URL: process.env.SERVER_URL,
    FRONT_END_URL: process.env.FRONT_END_URL,
};

export { paymentConfig, jwtConfig, dbConfig, serverConfig };

export default { paymentConfig, jwtConfig, dbConfig, serverConfig };
