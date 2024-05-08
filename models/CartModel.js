import { DataTypes, Model } from "sequelize";

import { sequelize } from "./database/Config.js";

class Cart extends Model {
    //
}

Cart.init(
    {
        quantity: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
        },
    },
    { sequelize, modelName: "cart" }
);

export { Cart };
