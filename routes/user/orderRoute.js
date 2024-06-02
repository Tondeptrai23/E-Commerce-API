import { Router } from "express";

import { OrderController } from "../../controllers/orderController.js";
import { verifyToken } from "../../middlewares/authJwt.js";

const router = Router();

router.get("/", verifyToken, OrderController.getOrders);

router.get("/:orderId", verifyToken, OrderController.getOrder);

router.post("/:orderId", verifyToken, OrderController.postOrder);

router.put("/:orderId", verifyToken, OrderController.updateOrder);

router.post("/:orderId/move-to-cart", verifyToken, OrderController.moveToCart);

router.delete("/:orderId", verifyToken, OrderController.deleteOrder);

router.delete("/", verifyToken, OrderController.deleteAllOrders);

export { router as userOrderRoute };
