import { Router } from "express";

import productsController from "../../../controllers/products/products.controller.js";
import {
    verifyToken,
    isAdmin,
} from "../../../middlewares/auth/authJwt.middlewares.js";

import productCategoryRoute from "./productCategory.route.js";
import productImageRoute from "./productImage.route.js";
import variantRoute from "./productVariant.route.js";

const adminProductRoute = Router();

adminProductRoute.use(productCategoryRoute);
adminProductRoute.use(productImageRoute);
adminProductRoute.use(variantRoute);

adminProductRoute.get(
    "/products",
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

export default adminProductRoute;
