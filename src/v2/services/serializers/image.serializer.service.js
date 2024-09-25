import imageService from "../products/image.service.js";
import Entity from "./index.serializer.service.js";

const ImageSerializer = new Entity({
    imageID: {
        type: "string",
        required: true,
    },
    url: [
        {
            type: "string",
        },
        function (obj) {
            return imageService.signImageURL(obj);
        },
    ],
    displayOrder: {
        type: "number",
    },
    productID: {
        type: "string",
    },
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
});

export default ImageSerializer;
