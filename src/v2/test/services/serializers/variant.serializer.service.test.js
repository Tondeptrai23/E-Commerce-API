import VariantSerializer from "../../../services/serializers/variant.serializer.service.js";

const date = "2024-01-01T00:00:00.000Z";

const variant = {
    variantID: "1",
    productID: "1",
    price: 100,
    stock: 10,
    sku: "SKU123",
    createdAt: new Date(date),
    updatedAt: new Date(date),
    image: {
        imageID: "1",
        url: "http://example.com/image.jpg",
        thumbnail: "http://example.com/thumbnail.jpg",
        productID: "1",
        displayOrder: 1,
        createdAt: new Date(date),
        updatedAt: new Date(date),
    },
    attributeValues: [
        {
            attributeValueID: "1",
            attribute: {
                attributeID: "1",
                name: "color",
                createdAt: new Date(date),
                updatedAt: new Date(date),
            },
            value: "Red",
        },
        {
            attributeValueID: "2",
            attribute: {
                attributeID: "2",
                name: "size",
                createdAt: new Date(date),
                updatedAt: new Date(date),
            },
            value: "M",
        },
    ],
};

describe("VariantSerializer", () => {
    test("should serialize variant data correctly", () => {
        const serializedData = VariantSerializer.parse(variant);

        expect(serializedData).toEqual(
            expect.objectContaining({
                variantID: "1",
                productID: "1",
                price: 100,
                stock: 10,
                discountPrice: null,
                sku: "SKU123",
                image: "http://example.com/image.jpg",
                attributes: {
                    color: "Red",
                    size: "M",
                },
            })
        );
    });

    test("should serialize variant data with timestamps", () => {
        const serializedData = VariantSerializer.parse(variant, {
            includeTimestamps: true,
        });

        expect(serializedData).toEqual(
            expect.objectContaining({
                variantID: "1",
                productID: "1",
                price: 100,
                stock: 10,
                discountPrice: null,
                sku: "SKU123",
                image: "http://example.com/image.jpg",
                attributes: {
                    color: "Red",
                    size: "M",
                },
                createdAt: new Date(date),
                updatedAt: new Date(date),
            })
        );
    });
});
