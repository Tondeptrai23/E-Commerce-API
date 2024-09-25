import { StatusCodes } from "http-status-codes";
import productService from "../../services/products/product.service.js";
import { ConflictError, ResourceNotFoundError } from "../../utils/error.js";
import productBuilderService from "../../services/products/productBuilder.service.js";
import ProductSerializer from "../../services/serializers/product.serializer.service.js";

class ProductController {
    async getProducts(req, res) {
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
            console.log(err);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                errors: [
                    {
                        error: "ServerError",
                        message: "Server error when get products",
                    },
                ],
            });
        }
    }

    async getProduct(req, res) {
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
                            message: "Server error when get a product",
                        },
                    ],
                });
            }
        }
    }
    async addProduct(req, res) {
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
            if (err instanceof ConflictError) {
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
                            message: "Server error when add a product",
                        },
                    ],
                });
            }
        }
    }

    async updateProduct(req, res) {
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
                            message: "Server error when update a product",
                        },
                    ],
                });
            }
        }
    }

    async deleteProduct(req, res) {
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
                            message: "Server error when delete a product",
                        },
                    ],
                });
            }
        }
    }
}

export default new ProductController();
