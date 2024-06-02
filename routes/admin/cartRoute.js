import { Router } from "express";

import { CartController } from "../../controllers/cartController.js";
import { isAdmin, verifyToken } from "../../middlewares/authJwt.js";

const router = Router();

router.get("/:userId/cart/", verifyToken, isAdmin, CartController.getCart);

router.post(
    "/:userId/cart/",
    verifyToken,
    isAdmin,
    CartController.fetchCartToOrder
);

router.delete(
    "/:userId/cart/:productId",
    verifyToken,
    isAdmin,
    CartController.deleteProduct
);

export { router as adminCartRoute };
