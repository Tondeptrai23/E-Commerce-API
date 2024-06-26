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
    },
    {
        sequelize,
        modelName: "order_item",
        timestamps: false,
    }
);

export { OrderItem };
