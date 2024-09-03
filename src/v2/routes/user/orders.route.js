import { Router } from "express";

import ordersController from "../../controllers/shopping/orders.controller.js";
import { verifyToken } from "../../middlewares/auth/authJwt.middlewares.js";
import validator from "../../middlewares/validators/index.validator.js";

const userOrderRoute = Router();

userOrderRoute.get(
    "/",
    validator.validateQueryGetOrderUser,
    validator.handleValidationErrors,
    verifyToken,
    ordersController.getOrders
);

userOrderRoute.get("/pending", verifyToken, ordersController.getPendingOrder);

userOrderRoute.get("/:orderID", verifyToken, ordersController.getOrder);

userOrderRoute.post(
    "/pending",
    validator.validatePostOrder,
    validator.handleValidationErrors,
    verifyToken,
    ordersController.postOrder
);

userOrderRoute.post(
    "/pending/coupons",
    validator.validateApplyCoupon,
    validator.handleValidationErrors,
    verifyToken,
    ordersController.applyCoupon
);

userOrderRoute.get(
    "/pending/coupons/recommended",
    verifyToken,
    ordersController.getRecommendedCoupons
);

userOrderRoute.patch(
    "/pending",
    validator.validatePatchOrder,
    validator.handleValidationErrors,
    verifyToken,
    ordersController.updateOrder
);

userOrderRoute.delete("/:orderID", verifyToken, ordersController.deleteOrder);

export default userOrderRoute;
