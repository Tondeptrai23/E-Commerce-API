import Entity from "./index.serializer.service.js";

const AttributeValueSerializer = new Entity({
    valueID: {
        type: "string",
    },
    value: {
        type: "string",
    },
    attributeID: {
        type: "string",
    },
    attribute: [
        {
            type: "string",
            default: undefined,
        },
        function (obj) {
            return obj.attribute.name;
        },
    ],
    createdAt: {
        type: "string",
    },
    updatedAt: {
        type: "string",
    },
});

export default AttributeValueSerializer;
