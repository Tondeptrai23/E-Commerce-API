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
        description: {
            type: DataTypes.STRING,
        },
        discountType: {
            type: DataTypes.ENUM("percentage", "fixed"),
            allowNull: false,
        },
        target: {
            type: DataTypes.ENUM("all", "single"),
            allowNull: false,
        },
        minimumOrderAmount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        maximumDiscountAmount: {
            type: DataTypes.INTEGER,
        },
        timesUsed: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        maxUsage: {
            type: DataTypes.INTEGER,
        },
        startDate: {
            type: DataTypes.DATEONLY,
        },
        endDate: {
            type: DataTypes.DATEONLY,
        },
    },
    {
        sequelize,
        modelName: "coupon",
        version: true,
    }
);

export default Coupon;
