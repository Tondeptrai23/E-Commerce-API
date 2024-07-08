import ImageSerializer from "../../../services/serializers/imageSerializer.service.js";

describe("ImageSerializer default", () => {
    let imageSerializer;
    beforeAll(() => {
        imageSerializer = new ImageSerializer();
    });

    test("should return the image object without timestamps if timestamps are not included", () => {
        const image = {
            imageID: "1",
            imagePath: "http://example.com/image.jpg",
            displayOrder: 1,
            productID: "1",
            updatedAt: "2024-08-10T00:00:00.000Z",
            createdAt: "2024-08-10T00:00:00.000Z",
        };

        const result = imageSerializer.serialize(image);
        expect(result).toEqual({
            imageID: "1",
            imagePath: "http://example.com/image.jpg",
            displayOrder: 1,
            productID: "1",
        });
        expect(result.updatedAt).toBeUndefined();
        expect(result.createdAt).toBeUndefined();
    });

    test("should return an empty object if no image is provided", () => {
        const result = imageSerializer.serialize();
        expect(result).toEqual({});
    });
});

describe("ImageSerializer with timestamps", () => {
    let imageSerializer;
    beforeAll(() => {
        imageSerializer = new ImageSerializer({ includeTimestamps: true });
    });

    test("should return the image object with timestamps if timestamps are included", async () => {
        const image = {
            imageID: "1",
            imagePath: "http://example.com/image.jpg",
            displayOrder: 1,
            productID: "1",
            updatedAt: "2024-08-10T00:00:00.000Z",
            createdAt: "2024-08-10T00:00:00.000Z",
        };

        const result = imageSerializer.serialize(image);
        expect(result).toEqual({
            imageID: "1",
            imagePath: "http://example.com/image.jpg",
            displayOrder: 1,
            productID: "1",
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        });
    });
});

describe("ImageSerializer without foreign keys", () => {
    let imageSerializer;
    beforeAll(() => {
        imageSerializer = new ImageSerializer({ includeForeignKeys: false });
    });

    test("should return the image object without foreign keys if foreign keys are not included", () => {
        const image = {
            imageID: "1",
            imagePath: "http://example.com/image.jpg",
            displayOrder: 1,
            productID: "1",
            updatedAt: "2024-08-10T00:00:00.000Z",
            createdAt: "2024-08-10T00:00:00.000Z",
        };

        const result = imageSerializer.serialize(image);
        expect(result).toEqual({
            imageID: "1",
            imagePath: "http://example.com/image.jpg",
            displayOrder: 1,
        });
        expect(result.productID).toBeUndefined();
    });
});
