import { StatusCodes } from "http-status-codes";
import { ConflictError, ResourceNotFoundError } from "../../utils/error.js";
import attributeService from "../../services/products/attribute.service.js";
import variantAttributeService from "../../services/products/variantAttribute.service.js";
import VariantSerializer from "../../services/serializers/variant.serializer.service.js";
import AttributeSerializer from "../../services/serializers/attribute.serializer.service.js";

class AttributeController {
    async getAttributes(req, res) {
        try {
            // Get attributes
            const { attributes, currentPage, totalPages, totalItems } =
                await attributeService.getAttributes(req.query);

            // Serialize
            const serializedAttributes = AttributeSerializer.parse(attributes);

            // Send response
            res.status(StatusCodes.OK).send({
                success: true,
                currentPage: currentPage,
                totalPages: totalPages,
                totalItems: totalItems,
                attributes: serializedAttributes,
            });
        } catch (err) {
            console.log(err);

            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                success: false,
                errors: [
                    {
                        error: "ServerError",
                        message: "Server error when getting attributes",
                    },
                ],
            });
        }
    }

    async getAttribute(req, res) {
        try {
            // Get attribute ID
            const attributeID = req.params.attributeID;

            // Get attribute
            const attribute = await attributeService.getAttribute(attributeID);

            // Serialize
            const serializedAttribute = AttributeSerializer.parse(attribute, {
                detailedValues: true,
            });

            // Send response
            res.status(StatusCodes.OK).send({
                success: true,
                attribute: serializedAttribute,
            });
        } catch (err) {
            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).send({
                    success: false,
                    errors: [
                        {
                            error: "NotFound",
                            message: "Attribute not found",
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
                            message: "Server error when getting attribute",
                        },
                    ],
                });
            }
        }
    }

    async createAttribute(req, res) {
        try {
            // Get params
            const { name, values } = req.body;

            // Create attribute
            const attribute = await attributeService.createAttribute(
                name,
                values
            );

            // Serialize
            const serializedAttribute = AttributeSerializer.parse(attribute);

            // Send response
            res.status(StatusCodes.CREATED).send({
                success: true,
                attribute: serializedAttribute,
            });
        } catch (err) {
            if (err instanceof ConflictError) {
                res.status(StatusCodes.CONFLICT).send({
                    success: false,
                    errors: [
                        {
                            error: "Conflict",
                            message: "Attribute name is taken",
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
                            message: "Server error when creating attribute",
                        },
                    ],
                });
            }
        }
    }

    async renameAttribute(req, res) {
        try {
            // Get params
            const { attributeID } = req.params;
            const { name } = req.body;

            // Rename attribute
            const attribute = await attributeService.renameAttribute(
                attributeID,
                name
            );

            // Serialize
            const serializedAttribute = AttributeSerializer.parse(attribute);

            // Send response
            res.status(StatusCodes.OK).send({
                success: true,
                attribute: serializedAttribute,
            });
        } catch (err) {
            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).send({
                    success: false,
                    errors: [
                        {
                            error: "NotFound",
                            message: "Attribute not found",
                        },
                    ],
                });
            } else if (err instanceof ConflictError) {
                res.status(StatusCodes.CONFLICT).send({
                    success: false,
                    errors: [
                        {
                            error: "Conflict",
                            message: "Attribute name is taken",
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
                            message: "Server error when renaming attribute",
                        },
                    ],
                });
            }
        }
    }

    async replaceAttribute(req, res) {
        try {
            // Get params
            const { attributeID } = req.params;
            const { name, values } = req.body;

            // Replace attribute
            const attribute = await attributeService.replaceAttribute(
                attributeID,
                name,
                values
            );

            // Serialize
            const serializedAttribute = AttributeSerializer.parse(attribute);

            // Send response
            res.status(StatusCodes.OK).send({
                success: true,
                attribute: serializedAttribute,
            });
        } catch (err) {
            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).send({
                    success: false,
                    errors: [
                        {
                            error: "NotFound",
                            message: "Attribute not found",
                        },
                    ],
                });
            } else if (err instanceof ConflictError) {
                res.status(StatusCodes.CONFLICT).send({
                    success: false,
                    errors: [
                        {
                            error: "Conflict",
                            message: "Attribute name is taken",
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
                            message: "Server error when replacing attribute",
                        },
                    ],
                });
            }
        }
    }

    async deleteAttribute(req, res) {
        try {
            // Get params
            const { attributeID } = req.params;

            // Delete attribute
            await attributeService.deleteAttribute(attributeID);

            // Send response
            res.status(StatusCodes.OK).send({
                success: true,
            });
        } catch (err) {
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
                console.log(err);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                    success: false,
                    errors: [
                        {
                            error: "ServerError",
                            message: "Server error when deleting attribute",
                        },
                    ],
                });
            }
        }
    }

    async getAttributeVariants(req, res) {
        try {
            // Get attribute ID
            const { attributeID } = req.params;

            // Get attribute
            const attribute = await attributeService.getAttribute(attributeID);
            if (!attribute) {
                throw new ResourceNotFoundError("Attribute not found");
            }

            // Get attribute variants
            const { variants, totalItems, totalPages, currentPage } =
                await variantAttributeService.getVariantsByAttribute(
                    attributeID,
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
                console.log(err);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                    success: false,
                    errors: [
                        {
                            error: "ServerError",
                            message:
                                "Server error when getting attribute variants",
                        },
                    ],
                });
            }
        }
    }
}

export default new AttributeController();
