import { Router } from "express";

import couponController from "../../controllers/shopping/coupons.controller.js";

const adminCouponRoute = Router();

adminCouponRoute.get("/coupons", couponController.getCoupons);

adminCouponRoute.get("/coupons/:couponID", couponController.getCoupon);

adminCouponRoute.post("/coupons/add", couponController.addCoupon);

adminCouponRoute.put("/coupons/:couponID", couponController.updateCoupon);

adminCouponRoute.delete("/coupons/:couponID", couponController.deleteCoupon);

export default adminCouponRoute;
