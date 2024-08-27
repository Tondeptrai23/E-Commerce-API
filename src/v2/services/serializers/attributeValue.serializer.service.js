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
        },
        function (obj) {
            if (obj.attribute === undefined) {
                return undefined;
            }
            return obj.attribute.name;
        },
    ],
    createdAt: {
        type: "date",
        format: "iso",
    },
    updatedAt: {
        type: "date",
        format: "iso",
    },
});

export default AttributeValueSerializer;
