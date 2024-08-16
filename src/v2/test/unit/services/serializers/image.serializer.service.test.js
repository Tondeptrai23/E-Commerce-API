import ImageSerializer from "../../../../services/serializers/image.serializer.service.js";

describe("ImageSerializer", () => {
    const date = "2022-01-01T00:00:00.000Z";
    test("should serialize image data correctly", () => {
        const imageData = {
            imageID: "12345",
            url: "https://example.com/image.jpg",
            altText: "https://example.com/altText.jpg",
            productID: "1",
            displayOrder: 1,
            createdAt: new Date(date),
            updatedAt: new Date(date),
        };

        const serializedData = ImageSerializer.parse(imageData);

        expect(serializedData).toEqual({
            imageID: "12345",
            url: "https://example.com/image.jpg",
            altText: "https://example.com/altText.jpg",
            productID: "1",
            displayOrder: 1,
        });
    });

    test("should serialize image data correctly with includeTimestamps flag", () => {
        const imageData = {
            imageID: "12345",
            url: "https://example.com/image.jpg",
            altText: "https://example.com/altText.jpg",
            productID: "1",
            displayOrder: 1,
            createdAt: new Date(date),
            updatedAt: new Date(date),
        };

        const serializedData = ImageSerializer.parse(imageData, {
            includeTimestamps: true,
        });

        expect(serializedData).toEqual({
            imageID: "12345",
            url: "https://example.com/image.jpg",
            altText: "https://example.com/altText.jpg",
            productID: "1",
            displayOrder: 1,
            createdAt: new Date(date).toISOString(),
            updatedAt: new Date(date).toISOString(),
        });
    });

    test("should serialize array of image data correctly", () => {
        const imageData = [
            {
                imageID: "12345",
                url: "https://example.com/image.jpg",
                altText: "https://example.com/altText.jpg",
                productID: "1",
                displayOrder: 1,
                createdAt: new Date(date),
                updatedAt: new Date(date),
            },
            {
                imageID: "54321",
                url: "https://example.com/image2.jpg",
                altText: "https://example.com/altText2.jpg",
                productID: "1",
                displayOrder: 2,
                createdAt: new Date(date).toISOString(),
                updatedAt: new Date(date).toISOString(),
            },
        ];

        const serializedData = ImageSerializer.parse(imageData);

        expect(serializedData).toEqual([
            {
                imageID: "12345",
                url: "https://example.com/image.jpg",
                altText: "https://example.com/altText.jpg",
                productID: "1",
                displayOrder: 1,
            },
            {
                imageID: "54321",
                url: "https://example.com/image2.jpg",
                altText: "https://example.com/altText2.jpg",
                productID: "1",
                displayOrder: 2,
            },
        ]);
    });
    test("should return null fields object if no image provided", () => {
        const serializedData = ImageSerializer.parse();

        expect(serializedData).toEqual({
            imageID: null,
            url: null,
            altText: null,
            productID: null,
            displayOrder: null,
        });
    });
});
