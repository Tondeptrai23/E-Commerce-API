import { Router } from "express";

import { CartController } from "../../controllers/cartController.js";
import { verifyToken } from "../../middlewares/authJwt.js";
import {
    handleValidationErrors,
    validateQuantity,
} from "../../middlewares/validator.js";

const router = Router();

router.get("/", verifyToken, CartController.getCart);

router.post("/", verifyToken, CartController.fetchCartToOrder);

router.patch(
    "/:productId",
    validateQuantity,
    handleValidationErrors,
    verifyToken,
    CartController.updateProduct
);

router.delete("/:productId", verifyToken, CartController.deleteProduct);

router.delete("/", verifyToken, CartController.deleteCart);

export { router as userCartRoute };
