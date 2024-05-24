import { Router } from "express";

import { ProductController } from "../controllers/productController.js";
import { isAdmin, verifyToken } from "../middlewares/authJwt.js";

const route = Router();

route.post("/add", verifyToken, isAdmin, ProductController.postProduct);

route.get("/", ProductController.getAllProducts);

route.get("/:id", ProductController.getProduct);

route.post("/:id", verifyToken, ProductController.addProductToCart);

route.put("/:id", ProductController.updateProduct);

route.delete("/:id", ProductController.deleteProduct);

export { route as productRoute };
