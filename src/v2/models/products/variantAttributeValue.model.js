import { sequelize } from "../../config/database.config.js";
import { DataTypes, Model } from "sequelize";

class VariantAttributeValue extends Model {}

VariantAttributeValue.init(
    {
        variantAttributeValueID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
    },
    {
        sequelize,
        modelName: "variantAttributeValue",
        timestamps: false,
        tableName: "variant_attribute_values",
    }
);

export { VariantAttributeValue };
