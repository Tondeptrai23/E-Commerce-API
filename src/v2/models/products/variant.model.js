import { sequelize } from "../../config/database.config.js";
import { DataTypes, Model } from "sequelize";
import Product from "./product.model.js";

class Variant extends Model {}

Variant.init(
    {
        variantID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
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
        paranoid: true,
    }
);

// Hook to automatically set the variant name based on the product name
Variant.beforeCreate(async (variant) => {
    if (!variant.name) {
        const productName = await Product.findByPk(variant.productID);
        variant.name = productName.name;
    }
});

Variant.beforeBulkCreate(async (variants) => {
    for (const variant of variants) {
        if (!variant.name) {
            const productName = await Product.findByPk(variant.productID);
            variant.name = productName.name;
        }
    }
});

Variant.beforeUpdate(async (variant) => {
    if (!variant.name) {
        const productName = await Product.findByPk(variant.productID);
        variant.name = productName.name;
    }
});

export default Variant;
