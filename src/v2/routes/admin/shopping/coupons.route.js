import { Router } from "express";

import couponController from "../../../controllers/shopping/coupons.controller.js";
import {
    verifyToken,
    isAdmin,
} from "../../../middlewares/auth/authJwt.middleware.js";
import validator from "../../../middlewares/validators/index.validator.js";

const adminCouponRoute = Router();

adminCouponRoute.get(
    "/coupons",
    validator.validateQueryGetCoupon,
    validator.handleValidationErrors,
    verifyToken,
    isAdmin,
    couponController.getCoupons
);

adminCouponRoute.get(
    "/coupons/:couponID",
    verifyToken,
    isAdmin,
    couponController.getCoupon
);

adminCouponRoute.post(
    "/coupons",
    validator.validateCreateCoupon,
    validator.handleValidationErrors,
    verifyToken,
    isAdmin,
    couponController.addCoupon
);

adminCouponRoute.patch(
    "/coupons/:couponID",
    validator.validatePatchCoupon,
    validator.handleValidationErrors,
    verifyToken,
    isAdmin,
    couponController.patchCoupon
);

adminCouponRoute.delete(
    "/coupons/:couponID",
    verifyToken,
    isAdmin,
    couponController.deleteCoupon
);

adminCouponRoute.post(
    "/coupons/:couponID/products",
    validator.validateAddProductsCoupon,
    validator.handleValidationErrors,
    verifyToken,
    isAdmin,
    couponController.addProductsCoupon
);

adminCouponRoute.delete(
    "/coupons/:couponID/products/:productID",
    verifyToken,
    isAdmin,
    couponController.deleteProductsCoupon
);

adminCouponRoute.post(
    "/coupons/:couponID/categories",
    validator.validateAddCategoriesCoupon,
    validator.handleValidationErrors,
    verifyToken,
    isAdmin,
    couponController.addCategoriesCoupon
);

adminCouponRoute.delete(
    "/coupons/:couponID/categories/:categoryName",
    verifyToken,
    isAdmin,
    couponController.deleteCategoriesCoupon
);

export default adminCouponRoute;
