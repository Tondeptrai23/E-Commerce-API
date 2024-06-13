import { Router } from "express";

import orderController from "../../controllers/orders.controller.js";

const adminOrderRoute = Router();

adminOrderRoute.get("/:userID/orders", orderController.getOrders);

adminOrderRoute.get("/:userID/orders/:orderID", orderController.getOrder);

export default adminOrderRoute;
