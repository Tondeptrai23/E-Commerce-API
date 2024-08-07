import { ResourceNotFoundError } from "../../utils/error.js";
import { StatusCodes } from "http-status-codes";
import couponService from "../../services/shopping/coupon.service.js";
import CouponSerializer from "../../services/serializers/coupon.serializer.service.js";

class CouponController {
    async getCoupons(req, res) {
        try {
            // Call service
            const { coupons, currentPage, totalPages, totalItems } =
                await couponService.getCoupons(req.query);

            // Serialize data
            const serializedCoupons = CouponSerializer.parse(coupons);

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                data: {
                    currentPage,
                    totalPages,
                    totalItems,
                    coupons: serializedCoupons,
                },
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

            // Call service
            const coupon = await couponService.getCoupon(couponID);

            // Serialize data
            const serializedCoupon = CouponSerializer.parse(coupon);

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                data: {
                    coupon: serializedCoupon,
                },
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
            const serializedCoupon = CouponSerializer.parse(coupon);

            // Response
            res.status(StatusCodes.CREATED).json({
                success: true,
                data: {
                    coupon: serializedCoupon,
                },
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

    async putCoupon(req, res) {
        try {
            // Get data
            const {
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
                discountType,
                discountValue,
                minimumOrderAmount,
                maxUsage,
                startDate,
                endDate,
                timesUsed: 0,
            });

            // Serialize data
            const serializedCoupon = CouponSerializer.parse(coupon);

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                data: {
                    coupon: serializedCoupon,
                },
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

    async patchCoupon(req, res) {
        try {
            // Get data
            const { discountType, discountValue, minimumOrderAmount, endDate } =
                req.body;

            // Get param
            const { couponID } = req.params;

            // Call service
            const coupon = await couponService.updateCoupon(couponID, {
                discountType,
                discountValue,
                minimumOrderAmount,
                endDate,
            });

            // Serialize data
            const serializedCoupon = CouponSerializer.parse(coupon);

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                data: {
                    coupon: serializedCoupon,
                },
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
}

export default new CouponController();
