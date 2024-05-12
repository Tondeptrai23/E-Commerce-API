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
            defaultValue: DataTypes.UUIDV4,
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
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    },
    { sequelize, modelName: "product" }
);

export { Product };
