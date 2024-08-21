import { StatusCodes } from "http-status-codes";
import { ResourceNotFoundError, BadRequestError } from "../../utils/error.js";
import variantService from "../../services/products/variant.service.js";
import productBuilderService from "../../services/products/productBuilder.service.js";
import VariantSerializer from "../../services/serializers/variant.serializer.service.js";

class VariantController {
    async getProductVariants(req, res) {
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
                            message: "Server error when get product variants",
                        },
                    ],
                });
            }
        }
    }

    async getProductVariant(req, res) {
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
                            message: "Server error when get a product variant",
                        },
                    ],
                });
            }
        }
    }

    async addProductVariants(req, res) {
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
                            message: "Server error when add product variants",
                        },
                    ],
                });
            }
        }
    }

    async getVariants(req, res) {
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
            console.log(err);

            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                errors: [
                    {
                        error: "ServerError",
                        message: "Server error when get variants",
                    },
                ],
            });
        }
    }

    async getVariant(req, res) {
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
                            message: "Server error when get a variant",
                        },
                    ],
                });
            }
        }
    }

    async putVariant(req, res) {
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
                            message:
                                "Server error when update a product variant",
                        },
                    ],
                });
            }
        }
    }

    async patchVariant(req, res) {
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
            } else if (err instanceof BadRequestError) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    errors: [
                        {
                            error: "BadRequest",
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
                            message:
                                "Server error when update a product variant",
                        },
                    ],
                });
            }
        }
    }

    async deleteVariant(req, res) {
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
                            message:
                                "Server error when delete a product variant",
                        },
                    ],
                });
            }
        }
    }
}

export default new VariantController();
