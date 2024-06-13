import { sequelize } from "../../config/databaseConfig.js";
import { DataTypes, Model } from "sequelize";

class Payment extends Model {}

Payment.init(
    {
        paymentID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        paymentMethod: {
            type: DataTypes.ENUM("COD", "PayPal", "CreditCard"),
            allowNull: false,
        },
        paymentStatus: {
            type: DataTypes.STRING,
            defaultValue: "pending",
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "payment",
    }
);

export { Payment };
