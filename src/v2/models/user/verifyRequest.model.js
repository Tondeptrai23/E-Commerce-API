import { sequelize } from "../../config/database.config.js";
import { DataTypes, Model } from "sequelize";

class VerifyRequest extends Model {}

VerifyRequest.init(
    {
        requestID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        userID: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        expiredAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM("resetPassword", "verifyEmail"),
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "verifyRequest",
    }
);

export default VerifyRequest;
