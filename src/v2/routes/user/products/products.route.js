import { Router } from "express";

import productController from "../../../controllers/products/products.controller.js";
import variantController from "../../../controllers/products/variants.controller.js";
import imageController from "../../../controllers/products/images.controller.js";
import productCategoryController from "../../../controllers/products/productCategories.controller.js";

import validator from "../../../validators/index.validator.js";

const userProductRoute = Router();

userProductRoute.get(
    "/",
    validator.validateQueryGetProductUser,
    validator.handleValidationErrors,
    productController.getProducts
);

userProductRoute.get("/:productID", productController.getProduct);

userProductRoute.get(
    "/:productID/variants",
    variantController.getProductVariants
);

userProductRoute.get("/:productID/images", imageController.getProductImages);

userProductRoute.get(
    "/:productID/categories",
    productCategoryController.getProductCategories
);

export default userProductRoute;
