import { Router } from "express";

import productController from "../../controllers/products.controller.js";
import variantController from "../../controllers/variant.controller.js";
import productImageController from "../../controllers/productImage.controller.js";
import productCategoryController from "../../controllers/productCategory.controller.js";

const userProductRoute = Router();

userProductRoute.get("/", productController.getProducts);

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
