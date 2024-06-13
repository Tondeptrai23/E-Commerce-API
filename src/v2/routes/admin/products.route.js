import { Router } from "express";

import productsController from "../../controllers/products.controller.js";

const adminProductRoute = Router();

adminProductRoute.post("/products/add", productsController.addProduct);

adminProductRoute.put("/products/:productID", productsController.updateProduct);

adminProductRoute.delete(
    "/products/:productID",
    productsController.deleteProduct
);

/*

TODO: variant, attribute and image routes

*/

export default adminProductRoute;
