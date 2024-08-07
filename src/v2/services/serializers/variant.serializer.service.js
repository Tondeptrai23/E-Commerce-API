import Entity from "./index.serializer.service.js";

const VariantSerializer = new Entity({
    variantID: {
        type: "string",
        required: true,
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
    image: [
        {
            type: "string",
        },
        function (obj) {
            return obj.image.url;
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
                return obj.createdAt;
            }
            return undefined;
        },
    ],
});

export default VariantSerializer;
