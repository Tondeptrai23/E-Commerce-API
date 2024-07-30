import { sequelize } from "../../config/database.config.js";
import { DataTypes, Model } from "sequelize";

class Order extends Model {}

Order.init(
    {
        orderID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        orderDate: {
            type: DataTypes.DATEONLY,
            defaultValue: DataTypes.NOW,
        },
        status: {
            type: DataTypes.ENUM(
                "pending",
                "processing",
                "shipped",
                "delivered"
            ),
            defaultValue: "pending",
        },
        message: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        subTotal: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,
        },
        finalTotal: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,
        },
        paymentMethod: {
            type: DataTypes.ENUM("COD", "Momo", "Credit Card"),
            defaultValue: "COD",
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "order",
    }
);

export default Order;
