import { Router } from "express";

import cartController from "../../controllers/cart.controller.js";

const userCartRoute = Router();

userCartRoute.get("/", cartController.getCart);

userCartRoute.post("/", cartController.fetchCartToOrder);

userCartRoute.patch("/:productId", cartController.updateCart);

userCartRoute.delete("/:productId", cartController.deleteItem);

userCartRoute.delete("/", cartController.deleteCart);

export default userCartRoute;
