import { Router } from "express";

import { CartController } from "../controllers/CartController.js";

const route = Router();

route.get("/api/user/cart", CartController.getCart);

route.post("/api/user/cart", CartController.postCart);

route.patch("/api/user/cart/:productID", CartController.updateProduct);

route.delete("/api/user/cart/:productID", CartController.deleteProduct);

route.delete("/api/user/cart", CartController.deleteCart);

export { route as cartRoute };
