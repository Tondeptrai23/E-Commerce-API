import Entity from "./index.serializer.service.js";
import VariantSerializer from "./variant.serializer.service.js";
import ImageSerializer from "./image.serializer.service.js";

const ProductSerializer = new Entity({
    productID: {
        type: "string",
        required: true,
    },
    name: { type: "string" },
    description: { type: "string" },
    variants: [
        {
            type: "object",
        },
        function (obj, options) {
            return VariantSerializer.parse(obj.variants, options);
        },
    ],
    categories: [
        {
            type: "object",
        },
        function (obj) {
            return obj.categories.map((category) => category.name);
        },
    ],
    images: [
        {
            type: "object",
        },
        function (obj, options) {
            return obj.images.map((image) =>
                ImageSerializer.parse(image, options)
            );
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

export default ProductSerializer;
