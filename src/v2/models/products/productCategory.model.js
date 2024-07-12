import { sequelize } from "../../config/database.config.js";
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
        modelName: "productCategory",
        timestamps: false,
        tableName: "product_categories",
    }
);

export default ProductCategory;
