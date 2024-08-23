import { Router } from "express";

import categoryController from "../../controllers/products/categories.controller.js";
import validator from "../../middlewares/validators/index.validator.js";
import {
    verifyToken,
    isAdmin,
} from "../../middlewares/auth/authJwt.middlewares.js";

const adminCategoryRoute = Router();

adminCategoryRoute.get(
    "/categories",
    validator.validateQueryGetCategory,
    validator.handleValidationErrors,
    verifyToken,
    isAdmin,
    categoryController.getCategories
);

adminCategoryRoute.get(
    "/categories/:name",
    verifyToken,
    isAdmin,
    categoryController.getCategory
);

adminCategoryRoute.post(
    "/categories",
    validator.validateAddCategory,
    validator.handleValidationErrors,
    verifyToken,
    isAdmin,
    categoryController.addCategory
);

adminCategoryRoute.put(
    "/categories/:name",
    validator.validatePutCategory,
    validator.handleValidationErrors,
    verifyToken,
    isAdmin,
    categoryController.updateCategory
);

adminCategoryRoute.delete(
    "/categories/:name",
    verifyToken,
    isAdmin,
    categoryController.deleteCategory
);

export default adminCategoryRoute;
