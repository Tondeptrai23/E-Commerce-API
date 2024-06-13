import { sequelize } from "../../config/databaseConfig.js";
import { DataTypes, Model } from "sequelize";

class ProductCoupon extends Model {}

ProductCoupon.init(
    {
        productCouponID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
    },
    {
        sequelize,
        modelName: "product_coupon",
        timestamps: false,
    }
);

export { ProductCoupon };
