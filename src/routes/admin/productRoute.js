import { Router } from "express";

import { ProductController } from "../../controllers/productController.js";
import { verifyToken, isAdmin } from "../../middlewares/authJwt.js";
import {
    validateUpdateProduct,
    validateCreateProduct,
    handleValidationErrors,
} from "../../middlewares/validator.js";

const router = Router();

router.post(
    "/products/add",
    validateCreateProduct,
    handleValidationErrors,
    verifyToken,
    isAdmin,
    ProductController.createNewProduct
);

router.post(
    "/:userId/products/:productId",
    validateUpdateProduct,
    handleValidationErrors,
    verifyToken,
    isAdmin,
    ProductController.addProductToCart
);

router.put(
    "/products/:productId",
    verifyToken,
    isAdmin,
    ProductController.updateProduct
);

router.delete(
    "/products/:productId",
    verifyToken,
    isAdmin,
    ProductController.deleteProduct
);

export { router as adminProductRoute };
