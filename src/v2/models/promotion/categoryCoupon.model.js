import { sequelize } from "../../config/databaseConfig.js";
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
        modelName: "category_coupon",
        timestamps: false,
    }
);

export { CategoryCoupon };
