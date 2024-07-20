import { sequelize } from "../../config/database.config.js";
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
        modelName: "productCoupon",
        timestamps: false,
        tableName: "product_coupons",
    }
);

export default ProductCoupon;
