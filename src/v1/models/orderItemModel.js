import { DataTypes, Model } from "sequelize";

import { sequelize } from "../config/databaseConfig.js";

class OrderItem extends Model {
    //
}

OrderItem.init(
    {
        quantity: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    },
    { sequelize, modelName: "orderProduct" }
);

export { OrderItem };
