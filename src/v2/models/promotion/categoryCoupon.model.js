import { sequelize } from "../../config/database.config.js";
import { DataTypes, Model } from "sequelize";

class CategoryCoupon extends Model {}

CategoryCoupon.init(
    {
        categoryCouponID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
    },
    {
        sequelize,
        modelName: "categoryCoupon",
        timestamps: false,
        tableName: "category_coupons",
    }
);

export { CategoryCoupon };
