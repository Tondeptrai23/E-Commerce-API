import { Router } from "express";

import ordersController from "../../controllers/shopping/orders.controller.js";
import { verifyToken } from "../../middlewares/auth/authJwt.middlewares.js";

const userOrderRoute = Router();

userOrderRoute.get("/", verifyToken, ordersController.getOrders);

userOrderRoute.get("/:orderID", verifyToken, ordersController.getOrder);

userOrderRoute.post("/pending", verifyToken, ordersController.postOrder);

userOrderRoute.post(
    "/pending/coupons",
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
    verifyToken,
    ordersController.updateOrder
);

userOrderRoute.delete("/:orderID", verifyToken, ordersController.deleteOrder);

userOrderRoute.delete("/", verifyToken, ordersController.deleteAllOrders);

export default userOrderRoute;
