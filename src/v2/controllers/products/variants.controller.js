import { StatusCodes } from "http-status-codes";
import variantService from "../../services/products/variant.service.js";
import productBuilderService from "../../services/products/productBuilder.service.js";
import VariantSerializer from "../../services/serializers/variant.serializer.service.js";

class VariantController {
    async getProductVariants(req, res, next) {
        try {
            // Get request body
            const { productID } = req.params;
            const isAdmin = req.admin ? true : false;

            // Call services
            const variants = await variantService.getProductVariants(
                productID,
                {
                    includeDeleted: isAdmin,
                }
            );

            // Serialize data
            const serializedVariants = VariantSerializer.parse(variants, {
                includeTimestamps: isAdmin,
            });

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                variants: serializedVariants,
            });
        } catch (err) {
            next(err);
        }
    }

    async getProductVariant(req, res, next) {
        try {
            // Get request body
            const { productID, variantID } = req.params;
            const isAdmin = req.admin ? true : false;

            // Call services
            const variant = await variantService.getProductVariant(
                productID,
                variantID,
                {
                    includeDeleted: isAdmin,
                }
            );

            // Serialize data
            const serializedVariant = VariantSerializer.parse(variant, {
                includeTimestamps: isAdmin,
            });

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                variant: serializedVariant,
            });
        } catch (err) {
            next(err);
        }
    }

    async addProductVariants(req, res, next) {
        try {
            // Get request body
            const { productID } = req.params;
            const { variants } = req.body;
            const images = req.files ?? [];

            // Call services
            const product = await productBuilderService.addVariants(
                productID,
                variants,
                images
            );

            // Serialize data
            const serializedVariants = VariantSerializer.parse(
                product.variants,
                {
                    includeTimestamps: true,
                }
            );

            // Response
            res.status(StatusCodes.CREATED).json({
                success: true,
                variants: serializedVariants,
            });
        } catch (err) {
            next(err);
        }
    }

    async getVariants(req, res, next) {
        try {
            // Call services
            const { variants, totalPages, currentPage, totalItems } =
                await variantService.getVariants(req.query, {
                    includeDeleted: true,
                });

            // Serialize data
            const serializedVariants = VariantSerializer.parse(variants, {
                includeTimestamps: true,
            });

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                totalPages,
                currentPage,
                totalItems,
                variants: serializedVariants,
            });
        } catch (err) {
            next(err);
        }
    }

    async getVariant(req, res, next) {
        try {
            // Get request params
            const { variantID } = req.params;

            // Call services
            const variant = await variantService.getVariant(variantID, {
                includeDeleted: true,
            });

            // Serialize data
            const serializedVariant = VariantSerializer.parse(variant, {
                includeTimestamps: true,
            });

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                variant: serializedVariant,
            });
        } catch (err) {
            next(err);
        }
    }

    async putVariant(req, res, next) {
        try {
            // Get request body
            const { variantID } = req.params;
            const {
                name = null,
                stock,
                price,
                sku,
                discountPrice = null,
                imageID = null,
                attributes = {},
            } = req.body;

            // Call services
            const variant = await variantService.updateVariant(variantID, {
                name,
                stock,
                price,
                sku,
                discountPrice,
                imageID,
                attributes,
            });

            // Serialize data
            const serializedVariant = VariantSerializer.parse(variant, {
                includeTimestamps: true,
            });

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                variant: serializedVariant,
            });
        } catch (err) {
            next(err);
        }
    }

    async patchVariant(req, res, next) {
        try {
            // Get request body
            const { variantID } = req.params;
            const { name, stock, price, sku, imageID, discountPrice } =
                req.body;

            // Call services
            const variant = await variantService.updateVariant(variantID, {
                name,
                stock,
                price,
                sku,
                imageID,
                discountPrice,
            });

            // Serialize data
            const serializedVariant = VariantSerializer.parse(variant, {
                includeTimestamps: true,
            });

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                variant: serializedVariant,
            });
        } catch (err) {
            next(err);
        }
    }

    async deleteVariant(req, res, next) {
        try {
            // Get request body
            const { variantID } = req.params;

            // Call services
            await variantService.deleteVariant(variantID);

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
            });
        } catch (err) {
            next(err);
        }
    }
}

export default new VariantController();
