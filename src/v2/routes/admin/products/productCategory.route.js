import { Router } from "express";
import productCategoryController from "../../../controllers/productCategory.controller.js";
import { verifyToken, isAdmin } from "../../../middlewares/authJwt.js";

const productCategoryRoute = Router();

productCategoryRoute.get(
    "/products/:productID/categories",
    verifyToken,
    isAdmin,
    productCategoryController.getProductCategories
);

productCategoryRoute.post(
    "/products/:productID/categories",
    verifyToken,
    isAdmin,
    productCategoryController.addProductCategory
);

productCategoryRoute.put(
    "/products/:productID/categories",
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
