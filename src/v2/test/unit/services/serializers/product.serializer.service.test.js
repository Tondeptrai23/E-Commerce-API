import ProductSerializer from "../../../../services/serializers/product.serializer.service.js";

const date = "2024-01-01T00:00:00.000Z";
// Mock product object
const product = {
    productID: "1",
    name: "Product",
    description: "Description",
    createdAt: new Date(date),
    updatedAt: new Date(date),
    extraField: "Extra Field",
    images: [
        {
            imageID: "1",
            altText: "http://example.com/image.jpg",
            url: "http://example.com/image.jpg",
            displayOrder: 1,
            productID: "1",
            updatedAt: new Date(date),
            createdAt: new Date(date),
            extraField: "Extra Field",
        },
    ],
    variants: [
        {
            variantID: "1",
            productID: "1",
            name: "Product",
            price: 100,
            stock: 10,
            sku: "SKU",
            discountPrice: 90,
            createdAt: new Date(date),
            updatedAt: new Date(date),
            extraField: "Extra Field",
            imageID: "1",
            image: {
                imageID: "1",
                altText: "http://example.com/image.jpg",
                url: "http://example.com/image.jpg",
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
        },
    ],
    categories: [
        {
            categoryID: "1",
            name: "Category",
            createdAt: new Date(date),
            updatedAt: new Date(date),
            extraField: "Extra Field",
        },
    ],
};

describe("ProductSerializer", () => {
    test("should serialize product object", () => {
        const serializedProduct = ProductSerializer.parse(product);

        expect(serializedProduct).toEqual(
            expect.objectContaining({
                productID: "1",
                name: "Product",
                description: "Description",
                images: [
                    expect.objectContaining({
                        imageID: "1",
                        altText: "http://example.com/image.jpg",
                        url: "http://example.com/image.jpg",
                        displayOrder: 1,
                        productID: "1",
                    }),
                ],
                variants: [
                    expect.objectContaining({
                        variantID: "1",
                        productID: "1",
                        imageID: "1",
                        price: 100,
                        discountPrice: 90,
                        image: "http://example.com/image.jpg",
                        stock: 10,
                        sku: "SKU",
                        attributes: {
                            color: "Red",
                            size: "M",
                        },
                    }),
                ],
                categories: ["Category"],
            })
        );
    });

    test("should serialize product object with includeTimestamps flag", () => {
        const serializedProduct = ProductSerializer.parse(product, {
            includeTimestamps: true,
        });

        expect(serializedProduct).toEqual(
            expect.objectContaining({
                productID: "1",
                name: "Product",
                description: "Description",
                createdAt: new Date(date).toISOString(),
                updatedAt: new Date(date).toISOString(),
                images: [
                    expect.objectContaining({
                        imageID: "1",
                        altText: "http://example.com/image.jpg",
                        url: "http://example.com/image.jpg",
                        displayOrder: 1,
                        productID: "1",
                    }),
                ],
                variants: [
                    expect.objectContaining({
                        variantID: "1",
                        productID: "1",
                        imageID: "1",
                        name: "Product",
                        price: 100,
                        stock: 10,
                        sku: "SKU",
                        discountPrice: 90,
                        image: "http://example.com/image.jpg",
                        attributes: {
                            color: "Red",
                            size: "M",
                        },
                    }),
                ],
                categories: ["Category"],
            })
        );
    });

    test("should serialize product object with includeTimestampsForAll flag", () => {
        const serializedProduct = ProductSerializer.parse(product, {
            includeTimestampsForAll: true,
        });

        expect(serializedProduct).toEqual(
            expect.objectContaining({
                productID: "1",
                name: "Product",
                description: "Description",
                createdAt: new Date(date).toISOString(),
                updatedAt: new Date(date).toISOString(),
                images: [
                    expect.objectContaining({
                        imageID: "1",
                        altText: "http://example.com/image.jpg",
                        url: "http://example.com/image.jpg",
                        displayOrder: 1,
                        productID: "1",
                        createdAt: new Date(date).toISOString(),
                        updatedAt: new Date(date).toISOString(),
                    }),
                ],
                variants: [
                    expect.objectContaining({
                        variantID: "1",
                        productID: "1",
                        imageID: "1",
                        name: "Product",
                        price: 100,
                        stock: 10,
                        sku: "SKU",
                        discountPrice: 90,
                        image: "http://example.com/image.jpg",
                        createdAt: new Date(date).toISOString(),
                        updatedAt: new Date(date).toISOString(),
                        attributes: {
                            color: "Red",
                            size: "M",
                        },
                    }),
                ],
                categories: ["Category"],
            })
        );
    });
});
