import { Router } from "express";

import couponController from "../../controllers/shopping/coupons.controller.js";
import {
    verifyToken,
    isAdmin,
} from "../../middlewares/auth/authJwt.middlewares.js";

const adminCouponRoute = Router();

adminCouponRoute.get(
    "/coupons",
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
    verifyToken,
    isAdmin,
    couponController.addCoupon
);

adminCouponRoute.put(
    "/coupons/:couponID",
    verifyToken,
    isAdmin,
    couponController.updateCoupon
);

adminCouponRoute.delete(
    "/coupons/:couponID",
    verifyToken,
    isAdmin,
    couponController.deleteCoupon
);

export default adminCouponRoute;
