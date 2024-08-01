import categoryService from "../../services/products/category.service.js";
import CategorySerializer from "../../services/serializers/category.serializer.service.js";
import { StatusCodes } from "http-status-codes";
import { ResourceNotFoundError } from "../../utils/error.js";

class CategoryController {
    async getCategories(req, res) {
        try {
            // Get query params
            const categories = await categoryService.getCategories(req.query);

            // Serialize categories
            const serializedCategories = CategorySerializer.parse(categories);

            // Return serialized categories
            res.status(StatusCodes.OK).json({
                success: true,
                data: {
                    categories: serializedCategories,
                },
            });
        } catch (err) {
            console.log(err);

            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: "Server error in getting categories",
            });
        }
    }

    async getAscendantCategories(req, res) {
        try {
            // Get category ID
            const categoryName = req.params.name;

            // Get ascendant categories
            const categories = await categoryService.getAscendantCategories(
                categoryName
            );

            // Serialize categories
            const serializedCategories = CategorySerializer.parse(categories);

            // Return serialized categories
            res.status(StatusCodes.OK).json({
                success: true,
                data: {
                    categories: serializedCategories,
                },
            });
        } catch (err) {
            console.log(err);

            if (err instanceof ResourceNotFoundError) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    error: err.message,
                });
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    error: "Server error in getting categories",
                });
            }
        }
    }

    async getDescendantCategories(req, res) {
        try {
            // Get category ID
            const categoryName = req.params.name;

            // Get descendant categories
            const categories =
                await categoryService.getDescendantCategoriesByName(
                    categoryName
                );

            // Serialize categories
            const serializedCategories = CategorySerializer.parse(categories);

            // Return serialized categories
            res.status(StatusCodes.OK).json({
                success: true,
                data: {
                    categories: serializedCategories,
                },
            });
        } catch (err) {
            console.log(err);

            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    error: err.message,
                });
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    error: "Server error in getting categories",
                });
            }
        }
    }

    async getCategory(req, res) {
        try {
            // Get category ID
            const categoryName = req.params.name;

            // Get category
            const category = await categoryService.getCategory(categoryName);

            // Serialize category
            const serializedCategory = CategorySerializer.parse(category);

            // Return serialized category
            res.status(StatusCodes.OK).json({
                success: true,
                data: {
                    category: serializedCategory,
                },
            });
        } catch (err) {
            console.log(err);

            if (err instanceof ResourceNotFoundError) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    error: err.message,
                });
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    error: "Server error in getting category",
                });
            }
        }
    }

    async addCategory(req, res) {
        try {
            // Get category data
            const { name, description, parent } = req.body;

            // Create category
            const category = await categoryService.createCategory({
                name,
                description,
                parent,
            });

            // Serialize category
            const serializedCategory = CategorySerializer.parse(category, {
                includeTimestamps: true,
            });

            // Return serialized category
            res.status(StatusCodes.CREATED).json({
                success: true,
                data: {
                    category: serializedCategory,
                },
            });
        } catch (err) {
            console.log(err);

            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    error: err.message,
                });
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    error: "Server error in adding category",
                });
            }
        }
    }

    async updateCategory(req, res) {
        try {
            // Get category ID
            const categoryName = req.params.name;

            // Get category data
            const { name, description = null, parent = null } = req.body;

            // Update category
            const category = await categoryService.updateCategory(
                categoryName,
                {
                    name,
                    description,
                    parent,
                }
            );

            // Serialize category
            const serializedCategory = CategorySerializer.parse(category, {
                includeTimestamps: true,
            });

            // Return serialized category
            res.status(StatusCodes.OK).json({
                success: true,
                data: {
                    category: serializedCategory,
                },
            });
        } catch (err) {
            console.log(err);

            if (err instanceof ResourceNotFoundError) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    error: err.message,
                });
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    error: "Server error in updating category",
                });
            }
        }
    }

    async deleteCategory(req, res) {
        try {
            // Get category ID
            const categoryName = req.params.name;

            // Delete category
            await categoryService.deleteCategory(categoryName);

            // Return success response
            res.status(StatusCodes.OK).json({
                success: true,
            });
        } catch (err) {
            console.log(err);

            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    error: err.message,
                });
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    error: "Server error in deleting category",
                });
            }
        }
    }
}

export default new CategoryController();
