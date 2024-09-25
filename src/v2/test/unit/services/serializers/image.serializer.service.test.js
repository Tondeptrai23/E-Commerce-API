import ImageSerializer from "../../../../services/serializers/image.serializer.service.js";

describe("ImageSerializer", () => {
    const date = "2022-01-01T00:00:00.000Z";
    const imageData = {
        imageID: "12345",
        productID: "1",
        contentType: "image/jpeg",
        displayOrder: 1,
        createdAt: new Date(date),
        updatedAt: new Date(date),
    };
    const imagesData = [
        {
            imageID: "12345",
            productID: "1",
            contentType: "image/jpeg",
            displayOrder: 1,
            createdAt: new Date(date),
            updatedAt: new Date(date),
        },
        {
            imageID: "54321",
            productID: "1",
            contentType: "image/png",
            displayOrder: 2,
            createdAt: new Date(date),
            updatedAt: new Date(date),
        },
    ];

    test("should serialize image data correctly", () => {
        const serializedData = ImageSerializer.parse(imageData);

        expect(serializedData).toEqual({
            imageID: "12345",
            url: expect.stringContaining("12345.jpg"),
            productID: "1",
            displayOrder: 1,
        });
    });

    test("should serialize image data correctly with includeTimestamps flag", () => {
        const serializedData = ImageSerializer.parse(imageData, {
            includeTimestamps: true,
        });

        expect(serializedData).toEqual({
            imageID: "12345",
            url: expect.stringContaining("12345.jpg"),
            productID: "1",
            displayOrder: 1,
            createdAt: new Date(date).toISOString(),
            updatedAt: new Date(date).toISOString(),
        });
    });

    test("should serialize array of image data correctly", () => {
        const serializedData = ImageSerializer.parse(imagesData);

        expect(serializedData).toEqual([
            {
                imageID: "12345",
                url: expect.stringContaining("12345.jpg"),
                productID: "1",
                displayOrder: 1,
            },
            {
                imageID: "54321",
                url: expect.stringContaining("54321.png"),
                productID: "1",
                displayOrder: 2,
            },
        ]);
    });
});
