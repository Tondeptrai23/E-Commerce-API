import { sequelize } from "../../config/database.config.js";
import { DataTypes, Model } from "sequelize";

class OrderItem extends Model {}

OrderItem.init(
    {
        orderItemID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        priceAtPurchase: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        discountPriceAtPurchase: {
            type: DataTypes.FLOAT,
        },
    },
    {
        sequelize,
        modelName: "orderItem",
        timestamps: false,
        tableName: "order_items",
    }
);

export default OrderItem;
