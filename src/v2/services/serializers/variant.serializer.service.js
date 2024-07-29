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
            type: "Date",
        },
        function (obj, options) {
            if (options.isAdmin) {
                return obj.createdAt;
            }
            return undefined;
        },
    ],
    updatedAt: [
        {
            type: "Date",
        },
        function (obj, options) {
            if (options.isAdmin) {
                return obj.createdAt;
            }
            return undefined;
        },
    ],
});

export default VariantSerializer;
