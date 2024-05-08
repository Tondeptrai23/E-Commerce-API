import { sequelize } from "./database/Config.js";
import { DataTypes, Model } from "sequelize";

class Product extends Model {
    //
}

Product.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
        },
        imageURL: {
            type: DataTypes.STRING,
        },
    },
    { sequelize, modelName: "product" }
);

export { Product };
