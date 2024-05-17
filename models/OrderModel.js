import { DataTypes, Model } from "sequelize";

import { sequelize } from "./database/Config.js";

class Order extends Model {
    //
}

Order.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        isCheckedOut: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        payment: {
            type: DataTypes.ENUM,
            values: ["COD", "Paypal", "Visa"],
            defaultValue: "COD",
        },
        message: {
            type: DataTypes.STRING,
        },
    },
    { sequelize, modelName: "order" }
);

export { Order };
