import { sequelize } from "../../config/database.config.js";
import { DataTypes, Model } from "sequelize";

class User extends Model {}

User.init(
    {
        userID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
        },
        refreshToken: {
            type: DataTypes.STRING,
        },
        role: {
            type: DataTypes.ENUM("user", "admin"),
            defaultValue: "user",
        },
    },
    {
        sequelize,
        modelName: "user",
        paranoid: true,
    }
);

export default User;
