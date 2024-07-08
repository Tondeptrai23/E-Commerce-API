import VariantSerializer from "../../../services/serializers/variantSerializer.service.js";

const variant = {
    variantID: "1",
    productID: "1",
    price: 100,
    stock: 10,
    createdAt: "2024-08-10T00:00:00.000Z",
    updatedAt: "2024-08-10T00:00:00.000Z",
    attributeValues: [
        {
            attributeValueID: "1",
            attribute: {
                attributeID: "1",
                name: "Color",
                createdAt: "2024-08-10T00:00:00.000Z",
                updatedAt: "2024-08-10T00:00:00.000Z",
            },
            value: "Red",
        },
        {
            attributeValueID: "2",
            attribute: {
                attributeID: "2",
                name: "Size",
                createdAt: "2024-08-10T00:00:00.000Z",
                updatedAt: "2024-08-10T00:00:00.000Z",
            },
            value: "M",
        },
    ],
};

describe("VariantSerializer default", () => {
    let variantSerializer;
    beforeAll(() => {
        variantSerializer = new VariantSerializer();
    });

    test("should return the variant object", () => {
        const result = variantSerializer.serialize(variant);
        expect(result).toEqual({
            variantID: "1",
            price: 100,
            stock: 10,
            productID: "1",
            attributes: {
                color: "Red",
                size: "M",
            },
        });
    });

    test("should return an empty object if no variant is provided", () => {
        const result = variantSerializer.serialize();
        expect(result).toEqual({});
    });
});

describe("VariantSerializer with timestamps", () => {
    let variantSerializer;
    beforeAll(() => {
        variantSerializer = new VariantSerializer({ includeTimestamps: true });
    });

    test("should return the variant object with timestamps", () => {
        const result = variantSerializer.serialize(variant);
        expect(result).toEqual({
            variantID: "1",
            price: 100,
            stock: 10,
            productID: "1",
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            attributes: {
                color: "Red",
                size: "M",
            },
        });
    });
});

describe("VariantSerializer without foreign keys", () => {
    let variantSerializer;
    beforeAll(() => {
        variantSerializer = new VariantSerializer({
            includeForeignKeys: false,
        });
    });

    test("should return the variant object without foreign keys", () => {
        const result = variantSerializer.serialize(variant);
        expect(result).toEqual({
            variantID: "1",
            price: 100,
            stock: 10,
            attributes: {
                color: "Red",
                size: "M",
            },
        });
    });
});
