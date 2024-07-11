import { Router } from "express";

import ordersController from "../../controllers/shopping/orders.controller.js";

const userOrderRoute = Router();

userOrderRoute.get("/", ordersController.getOrders);

userOrderRoute.get("/:orderID", ordersController.getOrder);

userOrderRoute.post("/:orderID", ordersController.postOrder);

userOrderRoute.put("/:orderID", ordersController.updateOrder);

userOrderRoute.post("/:orderID/move-to-cart", ordersController.moveToCart);

userOrderRoute.delete("/:orderID", ordersController.deleteOrder);

userOrderRoute.delete("/", ordersController.deleteAllOrders);

export default userOrderRoute;
