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
        url: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        altText: {
            type: DataTypes.STRING,
            allowNull: true,
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
        paranoid: true,
    }
);

// Assume that every images belongs to a product
ProductImage.beforeBulkCreate(async (productImages) => {
    let currentMaxOrder = await ProductImage.max("displayOrder", {
        where: {
            productID: productImages[0].productID,
        },
    });
    for (const image of productImages) {
        image.displayOrder = 1 + currentMaxOrder ?? 0;
        currentMaxOrder++;
    }
});

ProductImage.beforeCreate(async (productImage) => {
    let currentMaxOrder = await ProductImage.max("displayOrder", {
        where: {
            productID: productImage.productID,
        },
    });
    productImage.displayOrder = 1 + currentMaxOrder ?? 0;
});

export default ProductImage;
