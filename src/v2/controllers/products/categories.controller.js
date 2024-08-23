import categoryService from "../../services/products/category.service.js";
import CategorySerializer from "../../services/serializers/category.serializer.service.js";
import { StatusCodes } from "http-status-codes";
import { ConflictError, ResourceNotFoundError } from "../../utils/error.js";

class CategoryController {
    async getCategories(req, res) {
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
            console.log(err);

            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                errors: [
                    {
                        error: "ServerError",
                        message: "Server error in getting categories",
                    },
                ],
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
            if (err instanceof ResourceNotFoundError) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    errors: [
                        {
                            error: "NotFound",
                            message: err.message,
                        },
                    ],
                });
            } else {
                console.log(err);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    errors: [
                        {
                            error: "ServerError",
                            message:
                                "Server error in getting ascendant categories",
                        },
                    ],
                });
            }
        }
    }

    async getDescendantCategories(req, res) {
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
            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    errors: [
                        {
                            error: "NotFound",
                            message: err.message,
                        },
                    ],
                });
            } else {
                console.log(err);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    errors: [
                        {
                            error: "ServerError",
                            message:
                                "Server error in getting descendant categories",
                        },
                    ],
                });
            }
        }
    }

    async getCategory(req, res) {
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
            if (err instanceof ResourceNotFoundError) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    errors: [
                        {
                            error: "NotFound",
                            message: err.message,
                        },
                    ],
                });
            } else {
                console.log(err);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    errors: [
                        {
                            error: "ServerError",
                            message: "Server error in getting category",
                        },
                    ],
                });
            }
        }
    }

    async addCategory(req, res) {
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
            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    errors: [
                        {
                            error: "NotFound",
                            message: err.message,
                        },
                    ],
                });
            } else if (err instanceof ConflictError) {
                res.status(StatusCodes.CONFLICT).json({
                    success: false,
                    errors: [
                        {
                            error: "Conflict",
                            message: err.message,
                        },
                    ],
                });
            } else {
                console.log(err);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    errors: [
                        {
                            error: "ServerError",
                            message: "Server error in creating category",
                        },
                    ],
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
            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    errors: [
                        {
                            error: "NotFound",
                            message: err.message,
                        },
                    ],
                });
            } else if (err instanceof ConflictError) {
                res.status(StatusCodes.CONFLICT).json({
                    success: false,
                    errors: [
                        {
                            error: "Conflict",
                            message: err.message,
                        },
                    ],
                });
            } else {
                console.log(err);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    errors: [
                        {
                            error: "ServerError",
                            message: "Server error in updating category",
                        },
                    ],
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
            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    errors: [
                        {
                            error: "NotFound",
                            message: err.message,
                        },
                    ],
                });
            } else {
                console.log(err);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    errors: [
                        {
                            error: "ServerError",
                            message: "Server error in deleting category",
                        },
                    ],
                });
            }
        }
    }
}

export default new CategoryController();
