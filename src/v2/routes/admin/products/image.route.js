import { Router } from "express";
import imageController from "../../../controllers/products/images.controller.js";
import {
    verifyToken,
    isAdmin,
} from "../../../middlewares/auth/authJwt.middleware.js";
import validator from "../../../middlewares/validators/index.validator.js";
import { imageConfig } from "../../../config/config.js";

const productImageRoute = Router();

productImageRoute.get(
    "/products/:productID/images",
    verifyToken,
    isAdmin,
    imageController.getProductImages
);

productImageRoute.post(
    "/products/:productID/images",
    imageConfig.upload.array("images", imageConfig.MAX_COUNT),
    validator.handleValidationFileUpload,
    validator.validateCreateImages,
    validator.handleValidationErrors,
    verifyToken,
    isAdmin,
    imageController.addProductImages
);

productImageRoute.patch(
    "/products/:productID/images",
    validator.validateReorderImages,
    validator.handleValidationErrors,
    verifyToken,
    isAdmin,
    imageController.setImagesOrder
);

productImageRoute.put(
    "/products/:productID/images/:imageID",
    imageConfig.upload.single("image"),
    validator.handleValidationFileUpload,
    validator.validateCreateImages,
    validator.handleValidationErrors,
    verifyToken,
    isAdmin,
    imageController.replaceProductImage
);

productImageRoute.delete(
    "/products/:productID/images/:imageID",
    verifyToken,
    isAdmin,
    imageController.deleteProductImage
);

export default productImageRoute;
