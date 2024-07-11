import { Router } from "express";

import cartController from "../../controllers/shopping/cart.controller.js";
import { verifyToken } from "../../middlewares/authJwt.js";

const userCartRoute = Router();

userCartRoute.get("/", verifyToken, cartController.getCart);

userCartRoute.post("/", verifyToken, cartController.fetchCartToOrder);

userCartRoute.post("/:variantID", verifyToken, cartController.addToCart);

userCartRoute.patch("/:variantID", verifyToken, cartController.updateCart);

userCartRoute.delete("/:variantID", verifyToken, cartController.deleteItem);

userCartRoute.delete("/", verifyToken, cartController.deleteCart);

export default userCartRoute;
