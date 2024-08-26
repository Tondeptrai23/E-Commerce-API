import attributeValueService from "../../services/products/attributeValue.service.js";
import { StatusCodes } from "http-status-codes";
import { ResourceNotFoundError, ConflictError } from "../../utils/error.js";
import variantAttributeService from "../../services/products/variantAttribute.service.js";
import AttributeValueSerializer from "../../services/serializers/attributeValue.serializer.service.js";
import VariantSerializer from "../../services/serializers/variant.serializer.service.js";

class AttributeValuesController {
    async getAttributeValues(req, res) {
        try {
            // Get attribute values
            const { values, totalItems, totalPages, currentPage } =
                await attributeValueService.getAttributeValues(req.query);

            // Serialize
            const serializedValues = AttributeValueSerializer.parse(values);

            // Send response
            res.status(StatusCodes.OK).send({
                success: true,
                currentPage: currentPage,
                totalPages: totalPages,
                totalItems: totalItems,
                values: serializedValues,
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

            // Serialize
            const serializedValue =
                AttributeValueSerializer.parse(attributeValue);

            // Send response
            res.status(StatusCodes.CREATED).send({
                success: true,
                value: serializedValue,
            });
        } catch (err) {
            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).send({
                    success: false,
                    errors: [
                        {
                            error: "NotFound",
                            message: err.message,
                        },
                    ],
                });
            } else if (StatusCodes.CONFLICT) {
                res.status(StatusCodes.CONFLICT).send({
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
            const { valueID, attributeID } = req.params;
            const { value } = req.body;

            // Rename attribute value
            const attributeValue =
                await attributeValueService.renameAttributeValue(
                    attributeID,
                    valueID,
                    value
                );

            // Send response
            res.status(StatusCodes.OK).send({
                success: true,
                value: attributeValue,
            });
        } catch (err) {
            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).send({
                    success: false,
                    errors: [
                        {
                            error: "NotFound",
                            message: err.message,
                        },
                    ],
                });
            } else if (err instanceof ConflictError) {
                res.status(StatusCodes.CONFLICT).send({
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
            const { valueID, attributeID } = req.params;
            const { value } = req.body;

            // Replace attribute value
            const attributeValue =
                await attributeValueService.replaceAttributeValue(
                    attributeID,
                    valueID,
                    value
                );

            //Serialize
            const serializedValue =
                AttributeValueSerializer.parse(attributeValue);

            // Send response
            res.status(StatusCodes.OK).send({
                success: true,
                value: serializedValue,
            });
        } catch (err) {
            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).send({
                    success: false,
                    errors: [
                        {
                            error: "NotFound",
                            message: err.message,
                        },
                    ],
                });
            } else if (err instanceof ConflictError) {
                res.status(StatusCodes.CONFLICT).send({
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
            const { valueID, attributeID } = req.params;

            // Delete attribute value
            await attributeValueService.deleteAttributeValue(
                attributeID,
                valueID
            );

            // Send response
            res.status(StatusCodes.OK).send({
                success: true,
            });
        } catch (err) {
            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).send({
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

            // Check if attribute value exists
            await attributeValueService.getAttributeValue(attributeID, valueID);

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
            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).send({
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
}

export default new AttributeValuesController();
