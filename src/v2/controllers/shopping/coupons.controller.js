import {
    BadRequestError,
    ConflictError,
    ResourceNotFoundError,
} from "../../utils/error.js";
import { StatusCodes } from "http-status-codes";
import couponService from "../../services/shopping/coupon.service.js";
import CouponSerializer from "../../services/serializers/coupon.serializer.service.js";
import { removeEmptyFields } from "../../utils/utils.js";

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
                currentPage,
                totalPages,
                totalItems,
                coupons: serializedCoupons,
            });
        } catch (err) {
            console.log(err);

            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                errors: [
                    {
                        error: "ServerError",
                        message: "Server error in getting coupons",
                    },
                ],
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
                coupon: serializedCoupon,
            });
        } catch (err) {
            console.log(err);

            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    errors: [
                        {
                            error: "NotFound",
                            message: err.message,
                        },
                    ],
                });
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    errors: [
                        {
                            error: "ServerError",
                            message: "Server error in getting coupon",
                        },
                    ],
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
            console.log(err);

            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    errors: [
                        {
                            error: "NotFound",
                            message: err.message,
                        },
                    ],
                });
            } else if (err instanceof ConflictError) {
                res.status(StatusCodes.CONFLICT).json({
                    success: false,
                    errors: [
                        {
                            error: "Conflict",
                            message: err.message,
                        },
                    ],
                });
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    errors: [
                        {
                            error: "ServerError",
                            message: "Server error in creating coupon",
                        },
                    ],
                });
            }
        }
    }

    async patchCoupon(req, res) {
        try {
            // Get data
            const {
                description,
                minimumOrderAmount,
                endDate,
                startDate,
                maxUsage,
            } = req.body;
            const couponData = removeEmptyFields({
                description,
                minimumOrderAmount,
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
            console.log(err);

            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    errors: [
                        {
                            error: "NotFound",
                            message: err.message,
                        },
                    ],
                });
            } else if (err instanceof BadRequestError) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    errors: [
                        {
                            error: "BadRequest",
                            message: err.message,
                        },
                    ],
                });
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    errors: [
                        {
                            error: "ServerError",
                            message: "Server error in updating coupon",
                        },
                    ],
                });
            }
        }
    }

    async deleteCoupon(req, res) {
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
            console.log(err);

            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    errors: [
                        {
                            error: "NotFound",
                            message: err.message,
                        },
                    ],
                });
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    errors: [
                        {
                            error: "ServerError",
                            message: "Server error in deleting coupon",
                        },
                    ],
                });
            }
        }
    }

    async addProductsCoupon(req, res) {
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
            console.log(err);

            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    errors: [
                        {
                            error: "NotFound",
                            message: err.message,
                        },
                    ],
                });
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    errors: [
                        {
                            error: "ServerError",
                            message:
                                "Server error in adding products to coupon",
                        },
                    ],
                });
            }
        }
    }

    async deleteProductsCoupon(req, res) {
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
            console.log(err);

            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    errors: [
                        {
                            error: "NotFound",
                            message: err.message,
                        },
                    ],
                });
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    errors: [
                        {
                            error: "ServerError",
                            message:
                                "Server error in deleting products from coupon",
                        },
                    ],
                });
            }
        }
    }

    async addCategoriesCoupon(req, res) {
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
            console.log(err);

            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    errors: [
                        {
                            error: "NotFound",
                            message: err.message,
                        },
                    ],
                });
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    errors: [
                        {
                            error: "ServerError",
                            message:
                                "Server error in adding categories to coupon",
                        },
                    ],
                });
            }
        }
    }

    async deleteCategoriesCoupon(req, res) {
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
            console.log(err);

            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    errors: [
                        {
                            error: "NotFound",
                            message: err.message,
                        },
                    ],
                });
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    errors: [
                        {
                            error: "ServerError",
                            message:
                                "Server error in deleting categories from coupon",
                        },
                    ],
                });
            }
        }
    }
}

export default new CouponController();
