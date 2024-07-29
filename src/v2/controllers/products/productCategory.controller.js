import { StatusCodes } from "http-status-codes";
import { ResourceNotFoundError } from "../../utils/error.js";
import productCategoryService from "../../services/products/productCategory.service.js";
import productService from "../../services/products/product.service.js";
import productBuilderService from "../../services/products/productBuilder.service.js";

class ProductCategory {
    async getProductCategories(req, res) {
        try {
            // Get request body
            const { productID } = req.params;

            // Call services
            let categories = await productCategoryService.getProductCategories(
                productID
            );

            // Serialize data

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                categories: categories,
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
                    error: "Server error when get product categories",
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
            let product = await productBuilderService.addCategories(
                productID,
                categories
            );

            // Serialize data

            // Response
            res.status(StatusCodes.CREATED).json({
                success: true,
                product: product,
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
                    error: "Server error when add a product category",
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
            let product = await productCategoryService.updateCategory(
                productID,
                categories
            );

            // Serialize data

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                product: product,
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
                    error: "Server error when update a product category",
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
            console.log(err);

            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    error: err.message,
                });
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    error: "Server error when delete a product category",
                });
            }
        }
    }
}

export default new ProductCategory();
