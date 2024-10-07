import { StatusCodes } from "http-status-codes";
import { ResourceNotFoundError } from "../../utils/error.js";
import attributeService from "../../services/products/attribute.service.js";
import variantAttributeService from "../../services/products/variantAttribute.service.js";
import VariantSerializer from "../../services/serializers/variant.serializer.service.js";
import AttributeSerializer from "../../services/serializers/attribute.serializer.service.js";

class AttributeController {
    async getAttributes(req, res, next) {
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
            next(err);
        }
    }

    async getAttribute(req, res, next) {
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
            next(err);
        }
    }

    async createAttribute(req, res, next) {
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
            next(err);
        }
    }

    async renameAttribute(req, res, next) {
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
            next(err);
        }
    }

    async replaceAttribute(req, res, next) {
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
            next(err);
        }
    }

    async deleteAttribute(req, res, next) {
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
            next(err);
        }
    }

    async getAttributeVariants(req, res, next) {
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
            next(err);
        }
    }
}

export default new AttributeController();
