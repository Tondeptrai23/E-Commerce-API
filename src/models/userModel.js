import { sequelize } from "../config/databaseConfig.js";
import { DataTypes, Model } from "sequelize";

class User extends Model {
    //
}

User.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM,
            values: ["ROLE_USER", "ROLE_ADMIN"],
            defaultValue: "ROLE_USER",
        },
    },
    { sequelize, modelName: "user" }
);

export { User };
