import { sequelize } from "./database/Config.js";
import { DataTypes, Model } from "sequelize";

class User extends Model {
    //
}

User.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
            validate: {
                isEmail: true,
                allowNull: false,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    { sequelize, modelName: "user" }
);

export { User };
