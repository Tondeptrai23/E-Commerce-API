import Entity from "./index.serializer.service.js";

const AttributeSerializer = new Entity({
    attributeID: {
        type: "string",
    },
    name: {
        type: "string",
    },
    values: [
        {
            type: "object",
            default: undefined,
        },
        function (obj, options) {
            if (options.detailedValues) {
                return obj.values;
            }
            return obj.values.map((value) => value.value);
        },
    ],
    createdAt: {
        type: "string",
    },
    updatedAt: {
        type: "string",
    },
});

export default AttributeSerializer;
