import { Router } from "express";

import categoryController from "../../controllers/products/categories.controller.js";

const adminCategoryRoute = Router();

adminCategoryRoute.get("/categories", categoryController.getCategories);

adminCategoryRoute.get("/categories/:name", categoryController.getCategory);

adminCategoryRoute.post("/categories", categoryController.addCategory);

adminCategoryRoute.put("/categories/:name", categoryController.updateCategory);

adminCategoryRoute.delete(
    "/categories/:name",
    categoryController.deleteCategory
);

export default adminCategoryRoute;
