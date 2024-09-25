import Entity from "./index.serializer.service.js";
import imageService from "../products/image.service.js";

const VariantSerializer = new Entity({
    variantID: {
        type: "string",
        required: true,
    },

    name: {
        type: "string",
    },

    price: {
        type: "number",
    },

    discountPrice: {
        type: "number",
    },

    stock: {
        type: "number",
    },

    sku: {
        type: "string",
    },

    productID: {
        type: "string",
    },

    imageID: {
        type: "string",
    },

    image: [
        {
            type: "string",
        },
        function (obj) {
            return imageService.signImageURL(obj.image);
        },
    ],

    attributes: [
        {
            type: "object",
        },
        function (obj) {
            const attributes = {};
            obj.attributeValues.forEach((attributeValue) => {
                attributes[attributeValue.attribute.name] =
                    attributeValue.value;
            });
            return attributes;
        },
    ],

    createdAt: [
        {
            type: "date",
            format: "iso",
        },
        function (obj, options) {
            if (options.includeTimestamps) {
                return obj.createdAt;
            }
            return undefined;
        },
    ],

    updatedAt: [
        {
            type: "date",
            format: "iso",
        },
        function (obj, options) {
            if (options.includeTimestamps) {
                return obj.updatedAt;
            }
            return undefined;
        },
    ],

    deletedAt: [
        {
            type: "date",
            format: "iso",
        },
        function (obj, options) {
            if (options.includeTimestamps) {
                return obj.deletedAt;
            }
            return undefined;
        },
    ],
});

export default VariantSerializer;
