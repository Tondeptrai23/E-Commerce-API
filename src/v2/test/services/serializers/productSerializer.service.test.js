import ProductSerializer from "../../../services/serializers/productSerializer.service.js";

// Mock product object
const product = {
    productID: "1",
    name: "Product",
    description: "Description",
    createdAt: "2024-08-10T00:00:00.000Z",
    updatedAt: "2024-08-10T00:00:00.000Z",
    defaultVariantID: "1",
    images: [
        {
            imageID: "1",
            imagePath: "http://example.com/image.jpg",
            displayOrder: 1,
            productID: "1",
            updatedAt: "2024-08-10T00:00:00.000Z",
            createdAt: "2024-08-10T00:00:00.000Z",
        },
    ],
    variants: [
        {
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
        },
    ],
    defaultVariant: {
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
    },
    categories: [
        {
            categoryID: "1",
            name: "Category",
            createdAt: "2024-08-10T00:00:00.000Z",
            updatedAt: "2024-08-10T00:00:00.000Z",
        },
    ],
};

describe("ProductSerializer default", () => {
    let productSerializer;
    beforeAll(() => {
        productSerializer = new ProductSerializer();
    });

    test("should return the product object", () => {
        const result = productSerializer.serialize(product);
        expect(result).toEqual({
            productID: "1",
            name: "Product",
            description: "Description",
            defaultVariantID: "1",
            images: [
                {
                    imageID: "1",
                    imagePath: "http://example.com/image.jpg",
                    displayOrder: 1,
                },
            ],
            variants: [
                {
                    variantID: "1",
                    price: 100,
                    stock: 10,
                    attributes: {
                        color: "Red",
                        size: "M",
                    },
                },
            ],
            defaultVariant: {
                variantID: "1",
                price: 100,
                stock: 10,
                attributes: {
                    color: "Red",
                    size: "M",
                },
            },
            categories: ["Category"],
        });
    });

    test("should return an empty object if no product is provided", () => {
        const result = productSerializer.serialize();
        expect(result).toEqual({});
    });
});

describe("ProductSerializer with timestamps", () => {
    let productSerializer;
    beforeAll(() => {
        productSerializer = new ProductSerializer({ includeTimestamps: true });
    });

    test("should return the product object with timestamps", () => {
        const result = productSerializer.serialize(product);
        expect(result).toEqual({
            productID: "1",
            name: "Product",
            description: "Description",
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            defaultVariantID: "1",
            images: [
                {
                    imageID: "1",
                    imagePath: "http://example.com/image.jpg",
                    displayOrder: 1,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                },
            ],
            variants: [
                {
                    variantID: "1",
                    price: 100,
                    stock: 10,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    attributes: {
                        color: "Red",
                        size: "M",
                    },
                },
            ],
            defaultVariant: {
                variantID: "1",
                price: 100,
                stock: 10,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                attributes: {
                    color: "Red",
                    size: "M",
                },
            },
            categories: ["Category"],
        });
    });
});

describe("ProductSerializer without foreign keys", () => {
    let productSerializer;
    beforeAll(() => {
        productSerializer = new ProductSerializer({
            includeForeignKeys: false,
        });
    });

    test("should return the product object without foreign keys", () => {
        const result = productSerializer.serialize(product);
        expect(result).toEqual({
            productID: "1",
            name: "Product",
            description: "Description",
            images: [
                {
                    imageID: "1",
                    imagePath: "http://example.com/image.jpg",
                    displayOrder: 1,
                },
            ],
            variants: [
                {
                    variantID: "1",
                    price: 100,
                    stock: 10,
                    attributes: {
                        color: "Red",
                        size: "M",
                    },
                },
            ],
            defaultVariant: {
                variantID: "1",
                price: 100,
                stock: 10,
                attributes: {
                    color: "Red",
                    size: "M",
                },
            },
            categories: ["Category"],
        });
    });
});
