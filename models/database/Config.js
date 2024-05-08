import { Sequelize } from "sequelize";
import "dotenv/config.js";

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        dialect: "mysql",
        host: "localhost",
        port: process.env.DB_PORT,
    }
);

export { sequelize };
