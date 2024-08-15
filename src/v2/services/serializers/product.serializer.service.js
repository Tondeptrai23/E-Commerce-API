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
    variant: [
        {
            type: "object",
        },
        function (obj, options) {
            if (!obj.variant) {
                return undefined;
            }
            const variantOptions = {
                ...options,
                includeTimestamps: options.includeTimestampsForAll,
            };
            return VariantSerializer.parse(obj.variant, variantOptions);
        },
    ],
    variants: [
        {
            type: "object",
        },
        function (obj, options) {
            if (!obj.variants) {
                return undefined;
            }
            const variantOptions = {
                ...options,
                includeTimestamps: options.includeTimestampsForAll,
            };
            return VariantSerializer.parse(obj.variants, variantOptions);
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
            if (!obj.images) {
                return undefined;
            }
            const imageOptions = {
                ...options,
                includeTimestamps: options.includeTimestampsForAll,
            };
            return ImageSerializer.parse(obj.images, imageOptions);
        },
    ],

    createdAt: [
        {
            type: "date",
            format: "iso",
        },
        function (obj, options) {
            if (options.includeTimestamps || options.includeTimestampsForAll) {
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
            if (options.includeTimestamps || options.includeTimestampsForAll) {
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
            if (options.includeTimestamps || options.includeTimestampsForAll) {
                return obj.deletedAt;
            }
            return undefined;
        },
    ],
});

export default ProductSerializer;
