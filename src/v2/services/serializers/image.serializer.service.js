import Entity from "./index.serializer.service.js";

const ImageSerializer = new Entity({
    imageID: {
        type: "string",
        required: true,
    },
    url: {
        type: "string",
    },
    thumbnail: {
        type: "string",
    },
    displayOrder: {
        type: "number",
    },
    productID: {
        type: "string",
    },
    createdAt: [
        {
            type: "Date",
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
            type: "Date",
        },
        function (obj, options) {
            if (options.includeTimestamps) {
                return obj.createdAt;
            }
            return undefined;
        },
    ],
});

export default ImageSerializer;
