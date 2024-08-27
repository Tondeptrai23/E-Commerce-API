import AttributeSerializer from "../../../../services/serializers/attribute.serializer.service.js";

const date = "2024-01-01T00:00:00.000Z";
const attributes = [
    {
        attributeID: "1",
        name: "color",
        createdAt: new Date(date),
        updatedAt: new Date(date),
        extraField: "Extra Field",
    },
    {
        attributeID: "2",
        name: "size",
        values: [
            {
                valueID: "1",
                attributeID: "1",
                createdAt: new Date(date),
                updatedAt: new Date(date),
                value: "Red",
                extraField: "Extra Field",
            },
            {
                valueID: "2",
                attributeID: "2",
                createdAt: new Date(date),
                updatedAt: new Date(date),
                value: "Large",
                extraField: "Extra Field",
            },
        ],
        createdAt: new Date(date),
        updatedAt: new Date(date),
        extraField: "Extra Field",
    },
];

describe("Attribute Serializer", () => {
    it("should serialize an attribute", () => {
        const serializedAttribute = AttributeSerializer.parse(attributes[1]);
        expect(serializedAttribute).toEqual({
            attributeID: "2",
            name: "size",
            values: ["Red", "Large"],
            createdAt: date,
            updatedAt: date,
        });
    });

    it("should serialize an array of attributes", () => {
        const serializedAttributes = AttributeSerializer.parse(attributes);
        expect(serializedAttributes).toEqual([
            {
                attributeID: "1",
                name: "color",
                values: [],
                createdAt: date,
                updatedAt: date,
            },
            {
                attributeID: "2",
                name: "size",
                values: ["Red", "Large"],
                createdAt: date,
                updatedAt: date,
            },
        ]);
    });

    it("should serialize an attribute with detailed values", () => {
        const serializedAttribute = AttributeSerializer.parse(attributes[1], {
            detailedValues: true,
        });
        expect(serializedAttribute).toEqual({
            attributeID: "2",
            name: "size",
            values: [
                {
                    valueID: "1",
                    attributeID: "1",
                    value: "Red",
                    createdAt: date,
                    updatedAt: date,
                },
                {
                    valueID: "2",
                    attributeID: "2",
                    value: "Large",
                    createdAt: date,
                    updatedAt: date,
                },
            ],
            createdAt: date,
            updatedAt: date,
        });
    });

    it("should serialize an array of attributes with detailed values", () => {
        const serializedAttributes = AttributeSerializer.parse(attributes, {
            detailedValues: true,
        });
        expect(serializedAttributes).toEqual([
            {
                attributeID: "1",
                name: "color",
                values: [],
                createdAt: date,
                updatedAt: date,
            },
            {
                attributeID: "2",
                name: "size",
                values: [
                    {
                        valueID: "1",
                        attributeID: "1",
                        value: "Red",
                        createdAt: date,
                        updatedAt: date,
                    },
                    {
                        valueID: "2",
                        attributeID: "2",
                        value: "Large",
                        createdAt: date,
                        updatedAt: date,
                    },
                ],
                createdAt: date,
                updatedAt: date,
            },
        ]);
    });
});
