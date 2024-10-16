import { Router } from "express";

import productsController from "../../../controllers/products/products.controller.js";
import {
    verifyToken,
    isAdmin,
} from "../../../middlewares/authJwt.middleware.js";
import validator from "../../../validators/index.validator.js";

import productCategoryRoute from "./productCategory.route.js";
import productImageRoute from "./image.route.js";
import productVariantRoute from "./productVariant.route.js";
import { imageConfig } from "../../../config/config.js";

const adminProductRoute = Router();

adminProductRoute.use(productCategoryRoute);
adminProductRoute.use(productImageRoute);
adminProductRoute.use(productVariantRoute);

adminProductRoute.get(
    "/products",
    validator.validateQueryGetProduct,
    validator.handleValidationErrors,
    verifyToken,
    isAdmin,
    productsController.getProducts
);

adminProductRoute.get(
    "/products/:productID",
    verifyToken,
    isAdmin,
    productsController.getProduct
);

adminProductRoute.post(
    "/products",
    imageConfig.upload.array("images", imageConfig.MAX_COUNT),
    validator.handleValidationFileUpload,
    validator.validateCreateProduct,
    validator.handleValidationErrors,
    verifyToken,
    isAdmin,
    productsController.addProduct
);

adminProductRoute.patch(
    "/products/:productID",
    validator.validatePatchProduct,
    validator.handleValidationErrors,
    verifyToken,
    isAdmin,
    productsController.updateProduct
);

adminProductRoute.delete(
    "/products/:productID",
    verifyToken,
    isAdmin,
    productsController.deleteProduct
);

adminProductRoute.post(
    "/products/:productID/recover",
    verifyToken,
    isAdmin,
    productsController.recoverProduct
);

export default adminProductRoute;
