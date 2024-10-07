import { StatusCodes } from "http-status-codes";
import productCategoryService from "../../services/products/productCategory.service.js";
import productBuilderService from "../../services/products/productBuilder.service.js";
import CategorySerializer from "../../services/serializers/category.serializer.service.js";
import ProductSerializer from "../../services/serializers/product.serializer.service.js";

class ProductCategory {
    async getProductCategories(req, res, next) {
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
            next(err);
        }
    }

    async addProductCategory(req, res, next) {
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
            next(err);
        }
    }

    async updateProductCategory(req, res, next) {
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
            next(err);
        }
    }

    async deleteProductCategory(req, res, next) {
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
            next(err);
        }
    }
}

export default new ProductCategory();
