import { Router } from "express";

import { CartController } from "../controllers/CartController.js";

const route = Router();

route.get("/api/cart", CartController.getCart);

route.post("/api/cart", CartController.postCart);

route.patch("/api/cart/:productID", CartController.updateProduct);

route.delete("/api/cart/:productID", CartController.deleteProduct);

route.delete("/api/cart", CartController.deleteCart);

export { route as cartRoute };
