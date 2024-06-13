import { Router } from "express";

import categoryController from "../../controllers/categories.controller.js";

const adminCategoryRoute = Router();

adminCategoryRoute.get("/categories", categoryController.getCategories);

adminCategoryRoute.get(
    "/categories/:categoryID",
    categoryController.getCategory
);

adminCategoryRoute.post("/categories", categoryController.addCategory);

adminCategoryRoute.put(
    "/categories/:categoryID",
    categoryController.updateCategory
);

adminCategoryRoute.delete(
    "/categories/:categoryID",
    categoryController.deleteCategory
);

export default adminCategoryRoute;
