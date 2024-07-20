import { Router } from "express";
import productImageController from "../../../controllers/products/productImage.controller.js";
import { verifyToken, isAdmin } from "../../../middlewares/authJwt.js";

const productImageRoute = Router();

productImageRoute.get(
    "/products/:productID/images",
    verifyToken,
    isAdmin,
    productImageController.getProductImages
);

productImageRoute.post(
    "/products/:productID/images",
    verifyToken,
    isAdmin,
    productImageController.addProductImages
);

productImageRoute.patch(
    "/products/:productID/images/:imageID",
    verifyToken,
    isAdmin,
    productImageController.updateProductImage
);

productImageRoute.post(
    "/products/:productID/images/order",
    verifyToken,
    isAdmin,
    productImageController.setImagesOrder
);

productImageRoute.delete(
    "/products/:productID/images/:imageID",
    verifyToken,
    isAdmin,
    productImageController.deleteProductImage
);

export default productImageRoute;
