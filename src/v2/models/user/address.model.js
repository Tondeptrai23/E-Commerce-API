import { sequelize } from "../../config/database.config.js";
import { DataTypes, Model } from "sequelize";

class ShippingAddress extends Model {}

ShippingAddress.init(
    {
        addressID: {
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
        isDefault: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        sequelize,
        modelName: "shippingAddress",
        tableName: "shipping_address",
        paranoid: true,
    }
);

export default ShippingAddress;
