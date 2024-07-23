import { Router } from "express";

import ordersController from "../../controllers/shopping/orders.controller.js";
import { verifyToken } from "../../middlewares/auth/authJwt.middlewares.js";
import validator from "../../middlewares/validators/index.validator.js";

const userOrderRoute = Router();

userOrderRoute.get("/", verifyToken, ordersController.getOrders);

userOrderRoute.get("/:orderID", verifyToken, ordersController.getOrder);

userOrderRoute.post(
    "/pending",
    validator.postOrder,
    validator.handleValidationErrors,
    verifyToken,
    ordersController.postOrder
);

userOrderRoute.post(
    "/pending/coupons",
    validator.applyCoupon,
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
    "/pending/address",
    validator.patchOrder,
    validator.handleValidationErrors,
    verifyToken,
    ordersController.updateOrder
);

userOrderRoute.delete("/:orderID", verifyToken, ordersController.deleteOrder);

userOrderRoute.delete("/", verifyToken, ordersController.deleteAllOrders);

export default userOrderRoute;
