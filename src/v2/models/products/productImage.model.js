import { sequelize } from "../../config/databaseConfig.js";
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
        modelName: "product_image",
    }
);

export { ProductImage };
