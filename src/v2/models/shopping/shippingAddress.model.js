import { sequelize } from "../../config/database.config.js";
import { DataTypes, Model } from "sequelize";

class ShippingAddress extends Model {}

ShippingAddress.init(
    {
        shippingAddressID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        recipientName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        district: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "shippingAddress",
        tableName: "shipping_address",
        timestamps: false,
    }
);

export default ShippingAddress;
