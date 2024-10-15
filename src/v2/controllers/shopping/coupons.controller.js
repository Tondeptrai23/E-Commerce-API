import { StatusCodes } from "http-status-codes";
import couponService from "../../services/shopping/coupon.service.js";
import CouponSerializer from "../../services/serializers/coupon.serializer.service.js";
import { removeEmptyFields } from "../../utils/utils.js";
import { validationResult } from "express-validator";

class CouponController {
    async getCoupons(req, res, next) {
        try {
            // Call service
            const { coupons, currentPage, totalPages, totalItems } =
                await couponService.getCoupons(req.query);

            // Serialize data
            const serializedCoupons = CouponSerializer.parse(coupons);

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                currentPage,
                totalPages,
                totalItems,
                coupons: serializedCoupons,
            });
        } catch (err) {
            next(err);
        }
    }

    async getCoupon(req, res, next) {
        try {
            // Get param
            const { couponID } = req.params;

            // Call service
            const coupon = await couponService.getCoupon(couponID);

            // Serialize data
            const serializedCoupon = CouponSerializer.parse(coupon);

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                coupon: serializedCoupon,
            });
        } catch (err) {
            next(err);
        }
    }

    async addCoupon(req, res, next) {
        try {
            // Get data
            const {
                code,
                discountType,
                discountValue,
                minimumOrderAmount,
                maximumDiscountAmount = null,
                description = null,
                target,
                maxUsage = null,
                startDate = null,
                endDate = null,
                products = [],
                categories = [],
            } = req.body;

            // Call service
            const coupon = await couponService.createCoupon({
                code,
                discountType,
                discountValue,
                description,
                target,
                minimumOrderAmount,
                maximumDiscountAmount,
                maxUsage,
                startDate,
                endDate,
                products,
                categories,
            });

            // Serialize data
            const serializedCoupon = CouponSerializer.parse(coupon);

            // Response
            res.status(StatusCodes.CREATED).json({
                success: true,
                coupon: serializedCoupon,
            });
        } catch (err) {
            next(err);
        }
    }

    async patchCoupon(req, res, next) {
        try {
            // Get data
            const {
                description,
                minimumOrderAmount,
                maximumDiscountAmount,
                endDate,
                startDate,
                maxUsage,
            } = req.body;
            const couponData = removeEmptyFields({
                description,
                minimumOrderAmount,
                maximumDiscountAmount,
                endDate,
                startDate,
                maxUsage,
            });

            // Get param
            const { couponID } = req.params;

            // Call service
            const coupon = await couponService.updateCoupon(
                couponID,
                couponData
            );

            // Serialize data
            const serializedCoupon = CouponSerializer.parse(coupon);

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                coupon: serializedCoupon,
            });
        } catch (err) {
            next(err);
        }
    }

    async deleteCoupon(req, res, next) {
        try {
            // Get param
            const { couponID } = req.params;

            // Call service
            await couponService.disableCoupon(couponID);

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
            });
        } catch (err) {
            next(err);
        }
    }

    async addProductsCoupon(req, res, next) {
        try {
            // Get data
            const { productIDs = [] } = req.body;

            // Get param
            const { couponID } = req.params;

            // Call service
            const coupon = await couponService.addProductsToCoupon(
                couponID,
                productIDs
            );

            // Serialize data
            const serializedCoupon = CouponSerializer.parse(coupon);

            // Response
            res.status(StatusCodes.CREATED).json({
                success: true,
                coupon: serializedCoupon,
            });
        } catch (err) {
            next(err);
        }
    }

    async deleteProductsCoupon(req, res, next) {
        try {
            // Get param
            const { couponID, productID } = req.params;

            // Call service
            await couponService.deleteProductFromCoupon(couponID, productID);

            //Response
            res.status(StatusCodes.OK).json({
                success: true,
            });
        } catch (err) {
            next(err);
        }
    }

    async addCategoriesCoupon(req, res, next) {
        try {
            // Get data
            const { categories = [] } = req.body;

            // Get param
            const { couponID } = req.params;

            // Call service
            const coupon = await couponService.addCategoriesToCoupon(
                couponID,
                categories
            );

            // Serialize data
            const serializedCoupon = CouponSerializer.parse(coupon);

            // Response
            res.status(StatusCodes.CREATED).json({
                success: true,
                coupon: serializedCoupon,
            });
        } catch (err) {
            next(err);
        }
    }

    async deleteCategoriesCoupon(req, res, next) {
        try {
            // Get param
            const { couponID, categoryName } = req.params;

            // Call service
            await couponService.deleteCategoryFromCoupon(
                couponID,
                categoryName
            );

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
            });
        } catch (err) {
            next(err);
        }
    }
}

export default new CouponController();
