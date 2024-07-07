import { StatusCodes } from "http-status-codes";
import productService from "../services/products/product.service.js";
import { ResourceNotFoundError } from "../utils/error.js";

class ProductController {
    async getProducts(req, res) {
        try {
            const { includeAssociated } = req.query;
            const products = await productService.getProducts({
                includeAssociated: includeAssociated,
            });

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
            const { includeAssociated } = req.query;
            const { productID } = req.body;
            const product = await productService.getProduct(productID, {
                includeAssociated: includeAssociated,
            });

            if (product === null) {
                throw new ResourceNotFoundError("Product not found");
            }

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
            const { variants, categories, imageURLs, ...productInfo } =
                req.body;

            const product = await productService.addProduct(
                productInfo,
                variants,
                categories,
                imageURLs
            );

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
            const { productID } = req.params;
            const { name, description, defaultVariantID } = req.body;

            const product = await productService.updateProduct(productID, {
                name,
                description,
                defaultVariantID,
            });

            if (product === null) {
                throw new ResourceNotFoundError("Product not found");
            }

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
            const { productID } = req.params;

            await productService.deleteProduct(productID);

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
