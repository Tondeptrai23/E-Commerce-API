import { sequelize } from "../../config/database.config.js";
import { DataTypes, Model } from "sequelize";

class Coupon extends Model {}

Coupon.init(
    {
        couponID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        discountValue: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        discountType: {
            type: DataTypes.ENUM("percentage", "fixed"),
            allowNull: false,
        },
        minimumOrderAmount: {
            type: DataTypes.INTEGER,
        },
        timesUsed: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        maxUsage: {
            type: DataTypes.INTEGER,
        },
        startDate: {
            type: DataTypes.DATE,
        },
        endDate: {
            type: DataTypes.DATE,
        },
    },
    {
        sequelize,
        modelName: "coupon",
    }
);

export { Coupon };
