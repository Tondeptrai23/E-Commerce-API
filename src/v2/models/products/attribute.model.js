import { sequelize } from "../../config/database.config.js";
import { DataTypes, Model } from "sequelize";

class Attribute extends Model {}

Attribute.init(
    {
        attributeID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "attribute",
    }
);

export default Attribute;
