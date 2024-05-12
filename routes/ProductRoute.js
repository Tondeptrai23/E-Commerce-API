import { Router } from "express";

import { ProductController } from "../controllers/ProductController.js";

const route = Router();

route.post("/add", ProductController.addOne);

route.get("/", ProductController.getAllProducts);

route.get("/:id", ProductController.getProduct);

route.put("/:id", ProductController.updateProduct);

route.delete("/:id", ProductController.deleteProduct);

export { route as productRoute };
