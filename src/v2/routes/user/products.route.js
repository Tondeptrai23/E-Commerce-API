import { Router } from "express";

import productController from "../../controllers/products/products.controller.js";
import variantController from "../../controllers/products/variant.controller.js";
import productImageController from "../../controllers/products/productImage.controller.js";
import productCategoryController from "../../controllers/products/productCategory.controller.js";

import validator from "../../middlewares/validators/index.validator.js";

const userProductRoute = Router();

userProductRoute.get(
    "/",
    validator.validateQueryGetProduct,
    validator.handleValidationErrors,
    productController.getProducts
);

userProductRoute.get("/:productID", productController.getProduct);

userProductRoute.get(
    "/:productID/variants",
    variantController.getProductVariants
);

userProductRoute.get(
    "/:productID/images",
    productImageController.getProductImages
);

userProductRoute.get(
    "/:productID/categories",
    productCategoryController.getProductCategories
);

export default userProductRoute;
