import { Router } from "express";

import ordersController from "../../controllers/shopping/orders.controller.js";
import { verifyToken } from "../../middlewares/authJwt.js";

const userOrderRoute = Router();

userOrderRoute.get("/", verifyToken, ordersController.getOrders);

userOrderRoute.get("/:orderID", verifyToken, ordersController.getOrder);

userOrderRoute.post("/:orderID", verifyToken, ordersController.postOrder);

userOrderRoute.put("/:orderID", verifyToken, ordersController.updateOrder);

userOrderRoute.post(
    "/:orderID/move-to-cart",
    verifyToken,
    ordersController.moveToCart
);

userOrderRoute.delete("/:orderID", verifyToken, ordersController.deleteOrder);

userOrderRoute.delete("/", verifyToken, ordersController.deleteAllOrders);

export default userOrderRoute;
