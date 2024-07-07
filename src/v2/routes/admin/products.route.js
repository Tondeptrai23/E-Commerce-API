import { Router } from "express";

import productsController from "../../controllers/products.controller.js";
import variantController from "../../controllers/variant.controller.js";
import productImageController from "../../controllers/productImage.controller.js";
import productCategoryController from "../../controllers/productCategory.controller.js";
import { verifyToken, isAdmin } from "../../middlewares/authJwt.js";

const adminProductRoute = Router();

adminProductRoute.post(
    "/products/add",
    verifyToken,
    isAdmin,
    productsController.addProduct
);

adminProductRoute.put(
    "/products/:productID",
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
    "/products/:productID/images",
    verifyToken,
    isAdmin,
    productImageController.addProductImages
);

adminProductRoute.put(
    "/products/:productID/images/:imageID",
    verifyToken,
    isAdmin,
    productImageController.updateProductImage
);

adminProductRoute.delete(
    "/products/:productID/images/:imageID",
    verifyToken,
    isAdmin,
    productImageController.deleteProductImage
);

adminProductRoute.post(
    "/products/:productID/variants",
    verifyToken,
    isAdmin,
    variantController.addProductVariant
);

adminProductRoute.put(
    "/products/:productID/variants/:variantID",
    verifyToken,
    isAdmin,
    variantController.updateProductVariant
);

adminProductRoute.delete(
    "/products/:productID/variants/:variantID",
    verifyToken,
    isAdmin,
    variantController.deleteProductVariant
);

adminProductRoute.post(
    "/products/:productID/categories",
    verifyToken,
    isAdmin,
    productCategoryController.addProductCategory
);

adminProductRoute.put(
    "/products/:productID/categories",
    verifyToken,
    isAdmin,
    productCategoryController.updateProductCategory
);

adminProductRoute.delete(
    "/products/:productID/categories",
    verifyToken,
    isAdmin,
    productCategoryController.deleteProductCategory
);

export default adminProductRoute;
