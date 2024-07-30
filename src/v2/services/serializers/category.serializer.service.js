import Entity from "./index.serializer.service.js";

const CategorySerializer = new Entity({
    categoryID: {
        type: "string",
        required: true,
    },
    name: { type: "string" },
    description: { type: "string" },
    parentID: { type: "string" },
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

export default CategorySerializer;
