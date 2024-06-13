import { sequelize } from "../../config/databaseConfig.js";
import { DataTypes, Model } from "sequelize";

class ProductCategory extends Model {}

ProductCategory.init(
    {
        productCategoryID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
    },
    {
        sequelize,
        modelName: "product_category",
        timestamps: false,
    }
);

export { ProductCategory };
