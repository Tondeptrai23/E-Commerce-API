import { Router } from "express";

import { OrderController } from "../../controllers/orderController.js";
import { isAdmin, verifyToken } from "../../middlewares/authJwt.js";

const router = Router();

router.get("/:userId/orders", verifyToken, isAdmin, OrderController.getOrders);

router.get(
    "/:userId/orders/:orderId",
    verifyToken,
    isAdmin,
    OrderController.getOrder
);

router.post(
    "/:userId/orders/:orderId/move-to-cart",
    verifyToken,
    isAdmin,
    OrderController.moveToCart
);

router.delete(
    "/:userId/orders/:orderId",
    verifyToken,
    isAdmin,
    OrderController.deleteOrder
);

export { router as adminOrderRoute };
