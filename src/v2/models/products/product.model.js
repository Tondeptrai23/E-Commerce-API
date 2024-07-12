import { sequelize } from "../../config/database.config.js";
import { DataTypes, Model } from "sequelize";

class Product extends Model {}

Product.init(
    {
        productID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "product",
    }
);

export default Product;
