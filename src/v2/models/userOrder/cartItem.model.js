import { sequelize } from "../../config/database.config.js";
import { DataTypes, Model } from "sequelize";

class CartItem extends Model {}

CartItem.init(
    {
        cartItemID: {
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
        modelName: "cartItem",
        timestamps: false,
        tableName: "cart_items",
    }
);

export { CartItem };
