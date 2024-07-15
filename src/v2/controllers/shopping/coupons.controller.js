import { ResourceNotFoundError } from "../../utils/error.js";
import { StatusCodes } from "http-status-codes";
import couponService from "../../services/shopping/coupon.service.js";

class CouponController {
    async getCoupons(req, res) {
        try {
            // Get params
            const { includeAssociated } = req.query;

            // Call service
            const coupons = await couponService.getCoupons({
                includeAssociated: includeAssociated === "true",
            });

            // Serialize data

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                coupons: coupons,
            });
        } catch (err) {
            console.log(err);

            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: "Server error in getting coupons",
            });
        }
    }

    async getCoupon(req, res) {
        try {
            // Get param
            const { couponID } = req.params;
            const { includeAssociated } = req.query;

            // Call service
            const coupon = await couponService.getCoupon(couponID, {
                includeAssociated: includeAssociated === "true",
            });

            // Serialize data

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                coupon: coupon,
            });
        } catch (err) {
            console.log(err);

            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    error: err.message,
                });
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    error: "Server error in getting coupon",
                });
            }
        }
    }

    async addCoupon(req, res) {
        try {
            // Get data
            const {
                code,
                discountType,
                discountValue,
                minimumOrderAmount,
                maxUsage = null,
                startDate = null,
                endDate = null,
            } = req.body;

            // Call service
            const coupon = await couponService.createCoupon({
                code,
                discountType,
                discountValue,
                minimumOrderAmount,
                maxUsage,
                startDate,
                endDate,
            });

            // Serialize data

            // Response
            res.status(StatusCodes.CREATED).json({
                success: true,
                coupon: coupon,
            });
        } catch (err) {
            console.log(err);

            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    error: err.message,
                });
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    error: "Server error in adding coupon",
                });
            }
        }
    }

    async updateCoupon(req, res) {
        try {
            // Get data
            const {
                code,
                discountType,
                discountValue,
                minimumOrderAmount,
                maxUsage = null,
                startDate = null,
                endDate = null,
            } = req.body;

            // Get param
            const { couponID } = req.params;

            // Call service
            const coupon = await couponService.updateCoupon(couponID, {
                code,
                discountType,
                discountValue,
                minimumOrderAmount,
                maxUsage,
                startDate,
                endDate,
            });

            // Serialize data

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                coupon: coupon,
            });
        } catch (err) {
            console.log(err);

            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    error: err.message,
                });
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    error: "Server error in updating coupon",
                });
            }
        }
    }

    async deleteCoupon(req, res) {
        try {
            // Get param
            const { couponID } = req.params;

            // Call service
            await couponService.deleteCoupon(couponID);

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
            });
        } catch (err) {
            console.log(err);

            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    error: err.message,
                });
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    error: "Server error in deleting coupon",
                });
            }
        }
    }

    async getRecommendedCoupons(req, res) {
        try {
            // Get params
            const { variantIDs } = req.params;

            // Call service
            let coupons = await couponService.getRecommendedCoupons(variantIDs);

            // Serialize data

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                coupons: coupons,
            });
        } catch (err) {
            console.log(err);

            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    error: err.message,
                });
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    error: "Server error in applying coupon",
                });
            }
        }
    }
}

export default new CouponController();
