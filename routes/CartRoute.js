import { Router } from "express";

import { CartController } from "../controllers/CartController.js";

const route = Router();

route.get("/", CartController.getCart);

route.post("/", CartController.postCart);

route.patch("/:productID", CartController.updateProduct);

route.delete("/:productID", CartController.deleteProduct);

route.delete("/", CartController.deleteCart);

export { route as cartRoute };
