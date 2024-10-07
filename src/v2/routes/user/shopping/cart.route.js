import { Router } from "express";

import cartController from "../../../controllers/shopping/cart.controller.js";
import { verifyToken } from "../../../middlewares/authJwt.middleware.js";
import validator from "../../../validators/index.validator.js";

const userCartRoute = Router();

userCartRoute.get("/", verifyToken, cartController.getCart);

userCartRoute.post(
    "/",
    validator.validateFetchCart,
    validator.handleValidationErrors,
    verifyToken,
    cartController.fetchCartToOrder
);

userCartRoute.post(
    "/:variantID",
    validator.validateAddToCart,
    validator.handleValidationErrors,
    verifyToken,
    cartController.addToCart
);

userCartRoute.patch(
    "/:variantID",
    validator.validateUpdateCart,
    validator.handleValidationErrors,
    verifyToken,
    cartController.updateCart
);

userCartRoute.delete("/:variantID", verifyToken, cartController.deleteItem);

userCartRoute.delete("/", verifyToken, cartController.deleteCart);

export default userCartRoute;
