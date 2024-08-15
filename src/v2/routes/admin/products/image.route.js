import { Router } from "express";
import productImageController from "../../../controllers/products/productImages.controller.js";
import {
    verifyToken,
    isAdmin,
} from "../../../middlewares/auth/authJwt.middlewares.js";
import validator from "../../../middlewares/validators/index.validator.js";

const productImageRoute = Router();

productImageRoute.get(
    "/products/:productID/images",
    verifyToken,
    isAdmin,
    productImageController.getProductImages
);

productImageRoute.post(
    "/products/:productID/images",
    validator.validateCreateImages,
    validator.handleValidationErrors,
    verifyToken,
    isAdmin,
    productImageController.addProductImages
);

productImageRoute.patch(
    "/products/:productID/images",
    validator.validateReorderImages,
    validator.handleValidationErrors,
    verifyToken,
    isAdmin,
    productImageController.setImagesOrder
);

productImageRoute.patch(
    "/products/:productID/images/:imageID",
    validator.validatePatchImage,
    validator.handleValidationErrors,
    verifyToken,
    isAdmin,
    productImageController.updateProductImage
);

productImageRoute.delete(
    "/products/:productID/images/:imageID",
    verifyToken,
    isAdmin,
    productImageController.deleteProductImage
);

export default productImageRoute;
