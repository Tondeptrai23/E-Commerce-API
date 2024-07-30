import { sequelize } from "../../config/database.config.js";
import { DataTypes, Model } from "sequelize";

class Variant extends Model {}

Variant.init(
    {
        variantID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        discountPrice: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        sku: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "variant",
    }
);

export default Variant;
