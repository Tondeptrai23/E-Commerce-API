import Category from "../../models/products/category.model.js";
import Product from "../../models/products/product.model.js";
import Coupon from "../../models/promotion/coupon.model.js";
import { ResourceNotFoundError } from "../../utils/error.js";

class CouponService {
    /**
     * Create a coupon
     *
     * @param {Object} couponData The coupon data to be created
     * @returns {Promise<Coupon>} The created coupon
     */
    async createCoupon(couponData) {
        const coupon = await Coupon.create(couponData);

        return coupon;
    }

    /**
     * Get all coupons
     *
     * @param {Object} options The options to get coupons
     * @param {Boolean} options.includeAssociated Include associated models
     *
     * @returns {Promise<Coupon[]>} The list of coupons
     */
    async getCoupons(
        options = {
            includeAssociated: false,
        }
    ) {
        const coupons = await Coupon.findAll({
            include: options.includeAssociated
                ? [
                      {
                          model: Category,
                          as: "categories",
                      },
                      {
                          model: Product,
                          as: "products",
                      },
                  ]
                : [],
        });

        return coupons;
    }

    /**
     * Get a coupon by id
     *
     * @param {String} couponID The id of the coupon to be retrieved
     * @param {Object} options The options to get the coupon
     * @param {Boolean} options.includeAssociated Include associated models
     *
     * @returns {Promise<Coupon>} The coupon
     * @throws {ResourceNotFoundError} If the coupon is not found
     */
    async getCoupon(
        couponID,
        options = {
            includeAssociated: false,
        }
    ) {
        const coupon = await Coupon.findByPk(couponID, {
            include: options.includeAssociated
                ? [
                      {
                          model: Category,
                          as: "categories",
                      },
                      {
                          model: Product,
                          as: "products",
                      },
                  ]
                : [],
        });

        if (!coupon) {
            throw new ResourceNotFoundError("Coupon not found");
        }

        return coupon;
    }

    /**
     * Update a coupon
     *
     * @param {String} couponID The id of the coupon to be updated
     * @param {Object} couponData The updated coupon data
     * @returns {Promise<Coupon>} The updated coupon
     * @throws {ResourceNotFoundError} If the coupon is not found
     */
    async updateCoupon(couponID, couponData) {
        const coupon = await Coupon.findByPk(couponID);

        if (!coupon) {
            throw new ResourceNotFoundError("Coupon not found");
        }

        return await coupon.update(couponData);
    }

    /**
     * Delete a coupon
     *
     * @param {String} couponID The id of the coupon to be deleted
     * @throws {ResourceNotFoundError} If the coupon is not found
     */
    async deleteCoupon(couponID) {
        const coupon = await Coupon.findByPk(couponID);

        if (!coupon) {
            throw new ResourceNotFoundError("Coupon not found");
        }

        await coupon.destroy();
    }
}

export default new CouponService();
