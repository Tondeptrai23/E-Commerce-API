import { Router } from "express";

import { OrderController } from "../controllers/OrderController.js";

const route = Router();

route.get("/", OrderController.getOrders);

route.get("/:orderId", OrderController.getOrder);

route.post("/:orderId", OrderController.postOrder);

route.put("/:orderId", OrderController.updateOrder);

route.post("/:orderId/move-to-cart", OrderController.moveToCart);

route.delete("/:orderId", OrderController.deleteOrder);

route.delete("/", OrderController.deleteAllOrders);

export { route as orderRoute };
