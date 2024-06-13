import { sequelize } from "../../config/databaseConfig.js";
import { DataTypes, Model } from "sequelize";

class AttributeValue extends Model {}

AttributeValue.init(
    {
        valueID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        value: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "attribute_value",
    }
);

export { AttributeValue };
