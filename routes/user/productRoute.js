import { Router } from "express";

import { ProductController } from "../../controllers/productController.js";
import { verifyToken } from "../../middlewares/authJwt.js";

const router = Router();

router.get("/", ProductController.getAllProducts);

router.get("/:productId", ProductController.getProduct);

router.post("/:productId", verifyToken, ProductController.addProductToCart);

export { router as userProductRoute };
