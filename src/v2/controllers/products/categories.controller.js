import categoryService from "../../services/products/category.service.js";
import CategorySerializer from "../../services/serializers/category.serializer.service.js";
import { StatusCodes } from "http-status-codes";
import { ConflictError, ResourceNotFoundError } from "../../utils/error.js";

class CategoryController {
    async getCategories(req, res, next) {
        try {
            // Get query params
            const { categories, currentPage, totalPages, totalItems } =
                await categoryService.getCategories(req.query);

            // Serialize categories
            const serializedCategories = CategorySerializer.parse(categories, {
                includeTimestamps: req.admin ? true : false,
            });

            // Return serialized categories
            res.status(StatusCodes.OK).json({
                success: true,
                currentPage: currentPage,
                totalPages: totalPages,
                totalItems: totalItems,
                categories: serializedCategories,
            });
        } catch (err) {
            next(err);
        }
    }

    async getAscendantCategories(req, res, next) {
        try {
            // Get category ID
            const categoryName = req.params.name;

            // Get ascendant categories
            const categories = await categoryService.getAscendantCategories(
                categoryName
            );
            if (categories.length === 0) {
                throw new ResourceNotFoundError("Category not found");
            }

            // Serialize categories
            const serializedCategories = CategorySerializer.parse(categories);

            // Return serialized categories
            res.status(StatusCodes.OK).json({
                success: true,
                categories: serializedCategories,
            });
        } catch (err) {
            next(err);
        }
    }

    async getDescendantCategories(req, res, next) {
        try {
            // Get category ID
            const categoryName = req.params.name;

            // Get descendant categories
            const categories = await categoryService.getDescendantCategories(
                categoryName
            );

            if (categories.length === 0) {
                throw new ResourceNotFoundError("Category not found");
            }

            // Serialize categories
            const serializedCategories = CategorySerializer.parse(categories);

            // Return serialized categories
            res.status(StatusCodes.OK).json({
                success: true,
                categories: serializedCategories,
            });
        } catch (err) {
            next(err);
        }
    }

    async getCategory(req, res, next) {
        try {
            // Get data
            const categoryName = req.params.name;

            // Get category
            const category = await categoryService.getCategory(categoryName);

            // Serialize category
            const serializedCategory = CategorySerializer.parse(category, {
                includeTimestamps: req.admin ? true : false,
            });

            // Return serialized category
            res.status(StatusCodes.OK).json({
                success: true,
                category: serializedCategory,
            });
        } catch (err) {
            next(err);
        }
    }

    async addCategory(req, res, next) {
        try {
            // Get category data
            const { name, description, parent } = req.body;

            // Check if category's name is taken
            const isTaken = await categoryService.isCategoryNameTaken(name);
            if (isTaken) {
                throw new ConflictError("Category already exists");
            }

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
                category: serializedCategory,
            });
        } catch (err) {
            next(err);
        }
    }

    async updateCategory(req, res, next) {
        try {
            // Get category ID
            const categoryName = req.params.name;

            // Get category data
            const { name, description = null, parent = null } = req.body;

            // Check if category's name is taken
            if (name !== categoryName) {
                const isTaken = await categoryService.isCategoryNameTaken(name);
                if (isTaken) {
                    throw new ConflictError("Category already exists");
                }
            }

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
                category: serializedCategory,
            });
        } catch (err) {
            next(err);
        }
    }

    async deleteCategory(req, res, next) {
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
            next(err);
        }
    }
}

export default new CategoryController();
