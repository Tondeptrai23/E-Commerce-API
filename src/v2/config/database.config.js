import { Sequelize, Transaction } from "sequelize";
import "dotenv/config.js";

// Automatically bind the transaction to the CLS namespace
import * as cls from "cls-hooked";
const namespace = cls.createNamespace("transaction-namespace");
Sequelize.useCLS(namespace);

let sequelize;
if (process.env.NODE_ENV === "test") {
    sequelize = new Sequelize(
        process.env.DB_TEST_NAME,
        process.env.DB_USERNAME,
        process.env.DB_PASSWORD,
        {
            dialect: "mysql",
            host: "localhost",
            port: process.env.DB_PORT,
            logging: false,
            isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
        }
    );
} else {
    sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USERNAME,
        process.env.DB_PASSWORD,
        {
            dialect: "mysql",
            host: "localhost",
            port: process.env.DB_PORT,
        }
    );
}

export { sequelize };
