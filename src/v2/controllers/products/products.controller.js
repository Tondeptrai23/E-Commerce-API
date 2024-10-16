import { StatusCodes } from "http-status-codes";
import productService from "../../services/products/product.service.js";
import { ConflictError, ResourceNotFoundError } from "../../utils/error.js";
import productBuilderService from "../../services/products/productBuilder.service.js";
import ProductSerializer from "../../services/serializers/product.serializer.service.js";

class ProductController {
    async getProducts(req, res, next) {
        try {
            const isAdmin = req.admin ? true : false;

            // Call services
            let { currentPage, totalPages, totalItems, products } =
                await productService.getProducts(req.query, {
                    includeDeleted: isAdmin,
                });

            // Serialize data
            const serializedProducts = ProductSerializer.parse(products, {
                includeTimestamps: isAdmin,
                includeTimestampsForAll: isAdmin,
            });

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                currentPage: currentPage,
                totalPages: totalPages,
                totalItems: totalItems,
                products: serializedProducts,
            });
        } catch (err) {
            next(err);
        }
    }

    async getProduct(req, res, next) {
        try {
            // Get query parameters
            const { productID } = req.params;
            const isAdmin = req.admin ? true : false;

            // Call services
            let product = await productService.getProduct(productID, {
                includeDeleted: isAdmin,
            });

            if (product === null) {
                throw new ResourceNotFoundError("Product not found");
            }

            // Serialize data
            const serializedProduct = ProductSerializer.parse(product, {
                includeTimestamps: isAdmin,
                includeTimestampsForAll: isAdmin,
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
    async addProduct(req, res, next) {
        try {
            // Get request body
            const { variants, categories, ...productInfo } = req.body;

            // Get images
            const images = req.files;

            // Call services
            // Check if product name is taken
            const isTaken = await productService.isProductNameTaken(
                productInfo.name
            );
            if (isTaken) {
                throw new ConflictError("Product name is taken");
            }

            // Add product
            const product = await productBuilderService.addProduct(
                productInfo,
                variants,
                categories,
                images
            );

            // Serialize data
            const serializedProduct = ProductSerializer.parse(product, {
                includeTimestamps: true,
                includeTimestampsForAll: false,
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

    async updateProduct(req, res, next) {
        try {
            // Get request body
            const { productID } = req.params;
            const { name, description } = req.body;

            // Call services
            // Check if product name is taken
            const isTaken = await productService.isProductNameTaken(name);
            if (isTaken) {
                throw new ConflictError("Product name is taken");
            }

            // Update product
            const product = await productService.updateProduct(productID, {
                name,
                description,
            });

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

    async deleteProduct(req, res, next) {
        try {
            // Get request body
            const { productID } = req.params;

            // Call services
            await productService.deleteProduct(productID);

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
            });
        } catch (err) {
            next(err);
        }
    }

    async recoverProduct(req, res, next) {
        try {
            // Get request body
            const { productID } = req.params;

            // Call services
            await productService.restoreProduct(productID);

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
            });
        } catch (err) {
            next(err);
        }
    }
}

export default new ProductController();
