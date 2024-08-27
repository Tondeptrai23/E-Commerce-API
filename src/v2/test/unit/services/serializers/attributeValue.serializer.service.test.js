import AttributeValueSerializer from "../../../../services/serializers/attributeValue.serializer.service.js";

const date = "2024-01-01T00:00:00.000Z";
const attributeValues = [
    {
        valueID: "1",
        attributeID: "1",
        attribute: {
            attributeID: "1",
            name: "color",
            createdAt: new Date(date),
            updatedAt: new Date(date),
            extraField: "Extra Field",
        },
        createdAt: new Date(date),
        updatedAt: new Date(date),
        value: "Red",
        extraField: "Extra Field",
    },
    {
        valueID: "2",
        attributeID: "2",
        attribute: {
            attributeID: "2",
            name: "size",
            createdAt: new Date(date),
            updatedAt: new Date(date),
            extraField: "Extra Field",
        },
        createdAt: new Date(date),
        updatedAt: new Date(date),
        value: "Large",
        extraField: "Extra Field",
    },
];

describe("Attribute Value Serializer", () => {
    it("should serialize an attribute value", () => {
        const serializedAttributeValue = AttributeValueSerializer.parse(
            attributeValues[0]
        );
        expect(serializedAttributeValue).toEqual({
            valueID: "1",
            attributeID: "1",
            attribute: "color",
            value: "Red",
            createdAt: date,
            updatedAt: date,
        });
    });

    it("should serialize an array of attribute values", () => {
        const serializedAttributeValues =
            AttributeValueSerializer.parse(attributeValues);
        expect(serializedAttributeValues).toEqual([
            {
                valueID: "1",
                attributeID: "1",
                attribute: "color",
                value: "Red",
                createdAt: date,
                updatedAt: date,
            },
            {
                valueID: "2",
                attributeID: "2",
                attribute: "size",
                value: "Large",
                createdAt: date,
                updatedAt: date,
            },
        ]);
    });
});
