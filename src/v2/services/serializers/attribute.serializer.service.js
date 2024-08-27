import Entity from "./index.serializer.service.js";
import AttributeValueSerializer from "./attributeValue.serializer.service.js";

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
            default: [],
        },
        function (obj, options) {
            if (options.detailedValues) {
                if (obj.values === undefined) {
                    return [];
                }
                return AttributeValueSerializer.parse(obj.values);
            }
            return obj.values.map((value) => value.value);
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

export default AttributeSerializer;
