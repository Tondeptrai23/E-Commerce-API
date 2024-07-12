import { sequelize } from "../../config/database.config.js";
import { DataTypes, Model } from "sequelize";

class ProductImage extends Model {}

ProductImage.init(
    {
        imageID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        imagePath: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        displayOrder: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "productImage",
        tableName: "product_images",
    }
);

export default ProductImage;
