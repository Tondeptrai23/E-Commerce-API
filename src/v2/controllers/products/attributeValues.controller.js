import attributeValueService from "../../services/products/attributeValue.service.js";
import { StatusCodes } from "http-status-codes";
import { ResourceNotFoundError, ConflictError } from "../../utils/error.js";
import variantAttributeService from "../../services/products/variantAttribute.service.js";

class AttributeValuesController {
    async getAttributeValues(req, res) {
        try {
            // Get attribute values
            const { attributeValues, totalItems, totalPages, currentPage } =
                await attributeValueService.getAttributeValues(req.query);

            // Send response
            res.status(StatusCodes.OK).send({
                success: true,
                currentPage: currentPage,
                totalPages: totalPages,
                totalItems: totalItems,
                attributeValues: attributeValues,
            });
        } catch (err) {
            console.log(err);

            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                success: false,
                errors: [
                    {
                        error: "ServerError",
                        message: "Server error when getting attribute values",
                    },
                ],
            });
        }
    }

    async createAttributeValue(req, res) {
        try {
            // Get params
            const { attributeID } = req.params;
            const { value } = req.body;

            // Create attribute value
            const attributeValue =
                await attributeValueService.addAttributeValue(
                    attributeID,
                    value
                );

            // Send response
            res.status(StatusCodes.OK).send({
                success: true,
                attributeValue: attributeValue,
            });
        } catch (err) {
            console.log(err);

            if (err instanceof ResourceNotFoundError) {
                return res.status(StatusCodes.NOT_FOUND).send({
                    success: false,
                    errors: [
                        {
                            error: "NotFound",
                            message: "Attribute not found",
                        },
                    ],
                });
            } else if (StatusCodes.CONFLICT) {
                return res.status(StatusCodes.CONFLICT).send({
                    success: false,
                    errors: [
                        {
                            error: "Conflict",
                            message: "Attribute value is taken",
                        },
                    ],
                });
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                    success: false,
                    errors: [
                        {
                            error: "ServerError",
                            message:
                                "Server error when creating attribute value",
                        },
                    ],
                });
            }
        }
    }

    async renameAttributeValue(req, res) {
        try {
            // Get params
            const { attributeValueID } = req.params;
            const { value } = req.body;

            // Rename attribute value
            const attributeValue =
                await attributeValueService.renameAttributeValue(
                    attributeValueID,
                    value
                );

            // Send response
            res.status(StatusCodes.OK).send({
                success: true,
                attributeValue: attributeValue,
            });
        } catch (err) {
            console.log(err);

            if (err instanceof ResourceNotFoundError) {
                return res.status(StatusCodes.NOT_FOUND).send({
                    success: false,
                    errors: [
                        {
                            error: "NotFound",
                            message: "Attribute not found",
                        },
                    ],
                });
            } else if (err instanceof ConflictError) {
                return res.status(StatusCodes.CONFLICT).send({
                    success: false,
                    errors: [
                        {
                            error: "Conflict",
                            message: "Attribute value is taken",
                        },
                    ],
                });
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                    success: false,
                    errors: [
                        {
                            error: "ServerError",
                            message:
                                "Server error when renaming attribute value",
                        },
                    ],
                });
            }
        }
    }

    async replaceAttributeValue(req, res) {
        try {
            // Get params
            const { attributeValueID } = req.params;
            const { value } = req.body;

            // Replace attribute value
            const attributeValue =
                await attributeValueService.replaceAttributeValue(
                    attributeValueID,
                    value
                );

            // Send response
            res.status(StatusCodes.OK).send({
                success: true,
                attributeValue: attributeValue,
            });
        } catch (err) {
            console.log(err);

            if (err instanceof ResourceNotFoundError) {
                return res.status(StatusCodes.NOT_FOUND).send({
                    success: false,
                    errors: [
                        {
                            error: "NotFound",
                            message: "Attribute not found",
                        },
                    ],
                });
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                    success: false,
                    errors: [
                        {
                            error: "ServerError",
                            message:
                                "Server error when replacing attribute value",
                        },
                    ],
                });
            }
        }
    }

    async deleteAttributeValue(req, res) {
        try {
            // Get params
            const { attributeValueID } = req.params;

            // Delete attribute value
            await attributeValueService.deleteAttributeValue(attributeValueID);

            // Send response
            res.status(StatusCodes.OK).send({
                success: true,
            });
        } catch (err) {
            console.log(err);

            if (err instanceof ResourceNotFoundError) {
                return res.status(StatusCodes.NOT_FOUND).send({
                    success: false,
                    errors: [
                        {
                            error: "NotFound",
                            message: "Attribute not found",
                        },
                    ],
                });
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                    success: false,
                    errors: [
                        {
                            error: "ServerError",
                            message:
                                "Server error when deleting attribute value",
                        },
                    ],
                });
            }
        }
    }

    async getAttributeValueVariants(req, res) {
        try {
            // Get attribute value ID
            const { attributeID, valueID } = req.params;

            // Get attribute value variants
            const { variants, totalItems, totalPages, currentPage } =
                await variantAttributeService.getVariantsByAttributeValue(
                    attributeID,
                    valueID,
                    req.query
                );

            // Serialize
            const serializedVariants = VariantSerializer.parse(variants, {
                includeTimestamps: true,
            });

            // Send response
            res.status(StatusCodes.OK).send({
                success: true,
                currentPage: currentPage,
                totalPages: totalPages,
                totalItems: totalItems,
                variants: serializedVariants,
            });
        } catch (err) {
            console.log(err);

            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                success: false,
                errors: [
                    {
                        error: "ServerError",
                        message:
                            "Server error when getting attribute value variants",
                    },
                ],
            });
        }
    }
}

export default new AttributeValuesController();
