import { StatusCodes } from "http-status-codes";
import { ResourceNotFoundError } from "../utils/error.js";
import variantService from "../services/products/variant.service.js";
import productBuilderService from "../services/products/productBuilder.service.js";

class VariantController {
    async getProductVariants(req, res) {
        try {
            const { productID } = req.params;

            const variants = await variantService.getProductVariants(productID);

            res.status(StatusCodes.OK).json({
                success: true,
                variants: variants,
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
                    error: "Server error when get product variants",
                });
            }
        }
    }

    async getVariant(req, res) {
        try {
            const { productID, variantID } = req.params;
            const variant = await variantService.getVariant(
                productID,
                variantID
            );

            res.status(StatusCodes.OK).json({
                success: true,
                variant: variant,
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
                    error: "Server error when get a product variant",
                });
            }
        }
    }

    async addProductVariant(req, res) {
        try {
            const { productID } = req.params;
            const { variants } = req.body;
            const { includeProduct } = req.query;

            const product = await productBuilderService.addVariants(
                productID,
                variants
            );

            let response;
            if (includeProduct === "true") {
                response = {
                    success: true,
                    product: product,
                };
            } else {
                response = {
                    success: true,
                    variants: product.variants,
                };
            }
            res.status(StatusCodes.CREATED).json(response);
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
                    error: "Server error when add a product variant",
                });
            }
        }
    }

    async updateProductVariant(req, res) {
        try {
            const { productID } = req.params;
            const { variantID } = req.params;
            const { size, color, stock, price, sku, imageOrder } = req.body;

            const variant = await variantService.updateVariant(
                productID,
                variantID,
                {
                    size,
                    color,
                    stock,
                    price,
                    sku,
                    imageOrder,
                }
            );

            res.status(StatusCodes.OK).json({
                success: true,
                variant: variant,
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
                    error: "Server error when update a product variant",
                });
            }
        }
    }

    async deleteProductVariant(req, res) {
        try {
            const { productID } = req.params;
            const { variantID } = req.params;

            await variantService.deleteVariant(productID, variantID);

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
                    error: "Server error when delete a product variant",
                });
            }
        }
    }
}

export default new VariantController();
