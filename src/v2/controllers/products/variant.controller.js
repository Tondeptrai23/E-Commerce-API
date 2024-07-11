import { StatusCodes } from "http-status-codes";
import { ResourceNotFoundError } from "../../utils/error.js";
import variantService from "../../services/products/variant.service.js";
import productBuilderService from "../../services/products/productBuilder.service.js";
import VariantSerializer from "../../services/serializers/variantSerializer.service.js";

class VariantController {
    async getProductVariants(req, res) {
        try {
            // Get request body
            const { productID } = req.params;

            // Call services
            let variants = await variantService.getProductVariants(productID);

            // Serialize data
            let variantSerializer;
            if (req.admin !== undefined) {
                variantSerializer = new VariantSerializer({
                    includeTimestamps: true,
                    includeForeignKeys: false,
                });
            } else {
                variantSerializer = new VariantSerializer({
                    includeTimestamps: false,
                    includeForeignKeys: false,
                });
            }
            variants = variants.map((variant) =>
                variantSerializer.serialize(variant)
            );

            // Response
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
            // Get request body
            const { productID, variantID } = req.params;

            // Call services
            let variant = await variantService.getVariant(productID, variantID);

            // Serialize data
            let variantSerializer;
            if (req.admin !== undefined) {
                variantSerializer = new VariantSerializer({
                    includeTimestamps: true,
                    includeForeignKeys: false,
                });
            } else {
                variantSerializer = new VariantSerializer({
                    includeTimestamps: false,
                    includeForeignKeys: false,
                });
            }
            variant = variantSerializer.serialize(variant);

            // Response
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
            // Get request body
            const { productID } = req.params;
            const { variants } = req.body;

            // Call services
            const product = await productBuilderService.addVariants(
                productID,
                variants
            );

            // Serialize data
            const variantSerializer = new VariantSerializer({
                includeForeignKeys: false,
            });
            const serializedVariants = product.variants.map((variant) =>
                variantSerializer.serialize(variant)
            );

            // Response
            const response = {
                success: true,
                variants: serializedVariants,
            };
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
            // Get request body
            const { productID } = req.params;
            const { variantID } = req.params;
            const { stock, price, sku, imageOrder } = req.body;

            // Call services
            let variant = await variantService.updateVariant(
                productID,
                variantID,
                {
                    stock,
                    price,
                    sku,
                    imageOrder,
                }
            );

            // Serialize data
            variant = new VariantSerializer({
                includeForeignKeys: false,
            }).serialize(variant);

            // Response
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
            // Get request body
            const { productID } = req.params;
            const { variantID } = req.params;

            // Call services
            await variantService.deleteVariant(productID, variantID);

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
                    error: "Server error when delete a product variant",
                });
            }
        }
    }
}

export default new VariantController();
