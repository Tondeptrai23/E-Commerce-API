import { StatusCodes } from "http-status-codes";
import { ConflictError, ResourceNotFoundError } from "../../utils/error.js";
import attributeService from "../../services/products/attribute.service.js";

class AttributeController {
    async getAttributes(req, res) {
        try {
            // Get attributes
            const { attributes, currentPage, totalPages, totalItems } =
                await attributeService.getAttributes(req.query);

            // Serialize
            const serializedAttributes = attributes.map((attribute) => {
                let { values, ...rest } = JSON.parse(JSON.stringify(attribute));
                return {
                    ...rest,
                    values: values.map((value) => value.value),
                };
            });

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

            // Send response
            res.status(StatusCodes.OK).send({
                success: true,
                attribute: attribute,
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
            const { name, values } = req.params;

            // Create attribute
            const attribute = await attributeService.createAttribute(
                name,
                values
            );

            // Send response
            res.status(StatusCodes.OK).send({
                success: true,
                attribute: attribute,
            });
        } catch (err) {
            console.log(err);

            if (err instanceof ConflictError) {
                return res.status(StatusCodes.CONFLICT).send({
                    success: false,
                    errors: [
                        {
                            error: "Conflict",
                            message: "Attribute name is taken",
                        },
                    ],
                });
            } else {
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

            // Send response
            res.status(StatusCodes.OK).send({
                success: true,
                attribute: attribute,
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
                            message: "Attribute name is taken",
                        },
                    ],
                });
            } else {
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

            // Send response
            res.status(StatusCodes.OK).send({
                success: true,
                attribute: attribute,
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
                            message: "Server error when deleting attribute",
                        },
                    ],
                });
            }
        }
    }

    async createAttributeValue(req, res) {
        try {
            // Get params
            const { attributeID } = req.params;
            const { value } = req.body;

            // Create attribute value
            const attributeValue = await attributeService.addAttributeValue(
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
            const attributeValue = await attributeService.renameAttributeValue(
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
            const attributeValue = await attributeService.replaceAttributeValue(
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
            await attributeService.deleteAttributeValue(attributeValueID);

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

    async getAttributeVariants(req, res) {
        try {
            // Get attribute ID
            const attributeID = req.params.attributeID;

            // Get attribute variants
            const variants = await attributeService.getAttributeVariants(
                attributeID
            );

            // Send response
            res.status(StatusCodes.OK).send({
                success: true,
                variants: variants,
            });
        } catch (err) {
            console.log(err);

            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                success: false,
                errors: [
                    {
                        error: "ServerError",
                        message: "Server error when getting attribute variants",
                    },
                ],
            });
        }
    }
}

export default new AttributeController();
