import { Router } from "express";

import { ProductController } from "../../controllers/productController.js";
import { verifyToken } from "../../middlewares/authJwt.js";
import {
    handleValidationErrors,
    validateProductFilter,
} from "../../middlewares/validator.js";

const router = Router();

router.get(
    "/",
    validateProductFilter,
    handleValidationErrors,
    ProductController.getAllProducts
);

router.get("/:productId", ProductController.getProduct);

router.post("/:productId", verifyToken, ProductController.addProductToCart);

export { router as userProductRoute };
