import VariantSerializer from "../../../../services/serializers/variant.serializer.service.js";

const date = "2024-01-01T00:00:00.000Z";

const variant = {
    variantID: "1",
    productID: "1",
    imageID: "1",
    name: "Product",
    price: 100,
    stock: 10,
    sku: "SKU",
    discountPrice: 90,
    createdAt: new Date(date),
    updatedAt: new Date(date),
    deletedAt: new Date(date),
    extraField: "Extra Field",
    image: {
        imageID: "1",
        contentType: "image/jpeg",
        displayOrder: 1,
        productID: "1",
        updatedAt: new Date(date),
        createdAt: new Date(date),
        extraField: "Extra Field",
    },
    attributeValues: [
        {
            attributeValueID: "1",
            attribute: {
                attributeID: "1",
                name: "color",
                createdAt: new Date(date),
                updatedAt: new Date(date),
                extraField: "Extra Field",
            },
            value: "Red",
            extraField: "Extra Field",
        },
        {
            attributeValueID: "2",
            attribute: {
                attributeID: "2",
                name: "size",
                createdAt: new Date(date),
                updatedAt: new Date(date),
                extraField: "Extra Field",
            },
            value: "M",
            extraField: "Extra Field",
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
                name: "Product",
                price: 100,
                stock: 10,
                discountPrice: 90,
                sku: "SKU",
                imageID: "1",
                image: expect.stringContaining("1.jpg"),
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
                name: "Product",
                price: 100,
                stock: 10,
                discountPrice: 90,
                sku: "SKU",
                imageID: "1",
                image: expect.stringContaining("1.jpg"),
                attributes: {
                    color: "Red",
                    size: "M",
                },
                createdAt: new Date(date).toISOString(),
                updatedAt: new Date(date).toISOString(),
                deletedAt: new Date(date).toISOString(),
            })
        );
    });
});
