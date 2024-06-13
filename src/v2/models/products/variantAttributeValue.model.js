import { sequelize } from "../../config/databaseConfig.js";
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
        modelName: "variant_attribute_value",
    }
);

export { VariantAttributeValue };
