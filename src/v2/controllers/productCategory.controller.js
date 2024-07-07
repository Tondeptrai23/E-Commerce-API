import { StatusCodes } from "http-status-codes";
import { ResourceNotFoundError } from "../utils/error.js";
import productCategoryService from "../services/products/productCategory.service.js";
import productService from "../services/products/product.service.js";
import productBuilderService from "../services/products/productBuilder.service.js";

class ProductCategory {
    async getProductCategories(req, res) {
        try {
            const { productID } = req.params;
            const categories =
                await productCategoryService.getProductCategories(productID);

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
            const { productID } = req.params;
            const { categories } = req.body;

            const product = await productBuilderService.addCategories(
                productID,
                categories
            );

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
            const { productID } = req.params;
            const { categories } = req.body;

            const product = await productCategoryService.updateCategory(
                productID,
                categories
            );

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
            const { productID } = req.params;
            const { categoryID } = req.params;

            await productCategoryService.deleteCategory(productID, categoryID);

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
