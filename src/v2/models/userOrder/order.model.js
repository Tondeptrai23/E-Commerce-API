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
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        orderStatus: {
            type: DataTypes.ENUM(
                "pending",
                "processing",
                "shipped",
                "delivered"
            ),
            defaultValue: "pending",
        },
        shippingAddress: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        totalAmount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "order",
    }
);

export { Order };
