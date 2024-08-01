import { Router } from "express";

import productController from "../../controllers/products/products.controller.js";
import variantController from "../../controllers/products/variant.controller.js";
import productImageController from "../../controllers/products/productImage.controller.js";
import productCategoryController from "../../controllers/products/productCategory.controller.js";

import validator from "../../middlewares/validators/index.validator.js";

const userProductRoute = Router();

/**
 * @swagger
 * tags:
 *   name: User Products
 *   description: API endpoints for managing user products
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     description: Retrieve a list of all products
 *     tags: [User Products]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter products by name
 *     responses:
 *       200:
 *         description: Returns an array of products
 *       400:
 *         description: Invalid request parameters
 *       500:
 *         description: Internal server error
 */
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
