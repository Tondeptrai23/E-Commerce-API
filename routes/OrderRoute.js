import { Router } from "express";

import { OrderController } from "../controllers/OrderController.js";

const route = Router();

route.get("/api/orders", OrderController.getOrders);

route.get("/api/orders/:orderId", OrderController.getOrder);

route.post("/api/orders/:orderId", OrderController.postOrder);

route.put("/api/orders/:orderId", OrderController.updateOrder);

route.post("/api/orders/:orderId/move-to-cart", OrderController.moveToCart);

route.delete("/api/orders/:orderId", OrderController.deleteOrder);

route.delete("/api/orders", OrderController.deleteAllOrders);

export { route as orderRoute };
