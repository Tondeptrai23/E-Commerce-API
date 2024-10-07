import { Router } from "express";
import productCategoryController from "../../../controllers/products/productCategories.controller.js";
import {
    verifyToken,
    isAdmin,
} from "../../../middlewares/authJwt.middleware.js";
import validator from "../../../validators/index.validator.js";

const productCategoryRoute = Router();

productCategoryRoute.get(
    "/products/:productID/categories",
    verifyToken,
    isAdmin,
    productCategoryController.getProductCategories
);

productCategoryRoute.post(
    "/products/:productID/categories",
    validator.validateAddCategoriesForProduct,
    validator.handleValidationErrors,
    verifyToken,
    isAdmin,
    productCategoryController.addProductCategory
);

productCategoryRoute.put(
    "/products/:productID/categories",
    validator.validatePutCategoriesForProduct,
    validator.handleValidationErrors,
    verifyToken,
    isAdmin,
    productCategoryController.updateProductCategory
);

productCategoryRoute.delete(
    "/products/:productID/categories/:categoryName",
    verifyToken,
    isAdmin,
    productCategoryController.deleteProductCategory
);

export default productCategoryRoute;
