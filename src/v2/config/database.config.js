import { Sequelize, Transaction } from "sequelize";
import { dbConfig } from "./config.js";

// Automatically bind the transaction to the CLS namespace
import * as cls from "cls-hooked";
const namespace = cls.createNamespace("transaction-namespace");
Sequelize.useCLS(namespace);

let sequelize = new Sequelize(
    dbConfig.DB_NAME,
    dbConfig.DB_USERNAME,
    dbConfig.DB_PASSWORD,
    {
        host: dbConfig.DB_HOST,
        dialect: dbConfig.DB_TYPE,
        port: dbConfig.DB_PORT,
        logging: dbConfig.DB_LOGGING,
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    }
);

export { sequelize };
