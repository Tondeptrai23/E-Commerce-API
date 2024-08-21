import { StatusCodes } from "http-status-codes";
import { ResourceNotFoundError } from "../../utils/error.js";
import productCategoryService from "../../services/products/productCategory.service.js";
import productBuilderService from "../../services/products/productBuilder.service.js";
import CategorySerializer from "../../services/serializers/category.serializer.service.js";
import ProductSerializer from "../../services/serializers/product.serializer.service.js";

class ProductCategory {
    async getProductCategories(req, res) {
        try {
            // Get request body
            const { productID } = req.params;

            // Call services
            const categories =
                await productCategoryService.getProductCategories(productID);

            // Serialize data
            const serializedCategories = CategorySerializer.parse(categories, {
                includeTimestamps: req.admin ? true : false,
            });

            // Response
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
                            message: "Server error when get product categories",
                        },
                    ],
                });
            }
        }
    }

    async addProductCategory(req, res) {
        try {
            // Get request body
            const { productID } = req.params;
            const { categories } = req.body;

            // Call services
            const product = await productBuilderService.addCategories(
                productID,
                categories
            );

            // Serialize data
            const serializedProduct = ProductSerializer.parse(product, {
                includeTimestamps: true,
            });

            // Response
            res.status(StatusCodes.CREATED).json({
                success: true,
                product: serializedProduct,
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
                            message: "Server error when add a product category",
                        },
                    ],
                });
            }
        }
    }

    async updateProductCategory(req, res) {
        try {
            // Get request body
            const { productID } = req.params;
            const { categories } = req.body;

            // Call services
            const product = await productCategoryService.updateCategory(
                productID,
                categories
            );

            // Serialize data
            const serializedProduct = ProductSerializer.parse(product, {
                includeTimestamps: true,
            });

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                product: serializedProduct,
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
                                "Server error when update a product category",
                        },
                    ],
                });
            }
        }
    }

    async deleteProductCategory(req, res) {
        try {
            // Get request body
            const { productID } = req.params;
            const { categoryName } = req.params;

            // Call services
            await productCategoryService.deleteCategory(
                productID,
                categoryName
            );

            // Response
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
                            message:
                                "Server error when delete a product category",
                        },
                    ],
                });
            }
        }
    }
}

export default new ProductCategory();
