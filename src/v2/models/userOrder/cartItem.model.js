import { sequelize } from "../../config/databaseConfig.js";
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
        modelName: "cart_item",
        timestamps: false,
    }
);

export { CartItem };
