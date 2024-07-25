import { StatusCodes } from "http-status-codes";
import productService from "../../services/products/product.service.js";
import { ResourceNotFoundError } from "../../utils/error.js";
import productBuilderService from "../../services/products/productBuilder.service.js";
import ProductSerializer from "../../services/serializers/productSerializer.service.js";

class ProductController {
    async getProducts(req, res) {
        try {
            // Get query parameters
            const { includeAssociated } = req.query;

            // Call services
            let products = await productService.getProducts(req.query);

            // Serialize data
            let serializer;
            if (req.admin !== undefined) {
                serializer = new ProductSerializer({
                    includeTimestamps: true,
                    includeForeignKeys: false,
                });
            } else {
                serializer = new ProductSerializer({
                    includeTimestamps: false,
                    includeForeignKeys: false,
                });
            }
            products = products.map((product) => serializer.serialize(product));

            // Response
            let response = {
                success: true,
                products: products,
            };
            res.status(StatusCodes.OK).json(response);
        } catch (err) {
            console.log(err);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: "Server error when get products",
            });
        }
    }

    async getProduct(req, res) {
        try {
            // Get query parameters
            const { productID } = req.params;

            // Call services
            let product = await productService.getProduct(productID);

            if (product === null) {
                throw new ResourceNotFoundError("Product not found");
            }

            // Serialize data
            let serializer;
            if (req.admin !== undefined) {
                serializer = new ProductSerializer({
                    includeTimestamps: true,
                    includeForeignKeys: false,
                });
            } else {
                serializer = new ProductSerializer({
                    includeTimestamps: false,
                    includeForeignKeys: false,
                });
            }
            product = serializer.serialize(product);

            // Response
            let response = {
                success: true,
                product: product,
            };
            res.status(StatusCodes.OK).json(response);
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
                    error: "Server error when get product",
                });
            }
        }
    }
    async addProduct(req, res) {
        try {
            // Get request body
            const { variants, categories, images, ...productInfo } = req.body;

            // Call services
            let product = await productBuilderService.addProduct(
                productInfo,
                variants,
                categories,
                images
            );

            // Serialize data
            const serializer = new ProductSerializer({
                includeTimestamps: false,
                includeForeignKeys: true,
            });
            product = serializer.serialize(product);

            // Response
            res.status(StatusCodes.CREATED).json({
                success: true,
                product: product,
            });
        } catch (err) {
            console.log(err);
            //
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: "Server error when add a product",
            });
        }
    }

    async updateProduct(req, res) {
        try {
            // Get request body
            const { productID } = req.params;
            const { name, description } = req.body;

            // Call services
            let product = await productService.updateProduct(productID, {
                name,
                description,
            });

            if (product === null) {
                throw new ResourceNotFoundError("Product not found");
            }

            // Serialize data
            const serializer = new ProductSerializer({
                includeTimestamps: false,
                includeForeignKeys: true,
            });
            product = serializer.serialize(product);

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
                    error: "Server error when update a product",
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
            console.log(err);

            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    error: err.message,
                });
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    error: "Server error when delete a product",
                });
            }
        }
    }
}

export default new ProductController();
