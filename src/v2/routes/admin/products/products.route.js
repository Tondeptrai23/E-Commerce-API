import { Router } from "express";

import productsController from "../../../controllers/products/products.controller.js";
import {
    verifyToken,
    isAdmin,
} from "../../../middlewares/auth/authJwt.middlewares.js";
import validator from "../../../middlewares/validators/index.validator.js";

import productCategoryRoute from "./productCategory.route.js";
import productImageRoute from "./image.route.js";
import productVariantRoute from "./productVariant.route.js";

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

export default adminProductRoute;
