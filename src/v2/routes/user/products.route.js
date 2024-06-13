import { Router } from "express";

import productController from "../../controllers/products.controller.js";

const userProductRoute = Router();

userProductRoute.get("/", productController.getProducts);

userProductRoute.get("/:productID", productController.getProduct);

export default userProductRoute;
