import { DataTypes, Model } from "sequelize";

import { sequelize } from "./database/Config.js";

class OrderItem extends Model {
    //
}

OrderItem.init(
    {
        quantity: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
        },
    },
    { sequelize, modelName: "order-product" }
);

export { OrderItem };
