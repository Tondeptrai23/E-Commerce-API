import { sequelize } from "../../config/database.config.js";
import { DataTypes, Model } from "sequelize";

class Category extends Model {}

Category.init(
    {
        categoryID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
        },
    },
    {
        sequelize,
        modelName: "category",
    }
);

export default Category;
