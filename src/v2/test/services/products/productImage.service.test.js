import productImageService from "../../../services/products/productImage.service.js";
import seedData from "../../../seedData.js";
import ProductImage from "../../../models/products/productImage.model.js";
import { ResourceNotFoundError } from "../../../utils/error.js";

beforeAll(async () => {
    await seedData();
}, 15000);

describe("ProductImageService", () => {
    describe("getProductImage", () => {
        test("should throw ResourceNotFoundError if the product is not found", async () => {
            const productID = "7";
            const imageID = "101";

            await expect(
                productImageService.getProductImage(productID, imageID)
            ).rejects.toThrow(ResourceNotFoundError);
        });

        test("should throw ResourceNotFoundError if the image is not found", async () => {
            const productID = "2";
            const imageID = "111";

            await expect(
                productImageService.getProductImage(productID, imageID)
            ).rejects.toThrow(ResourceNotFoundError);
        });

        test("should return the image of the product if both product and image exist", async () => {
            const productID = "1";
            const imageID = "101";

            const productImage = await productImageService.getProductImage(
                productID,
                imageID
            );

            expect(productImage).toBeInstanceOf(ProductImage);
            expect(productImage.productID).toBe(productID);
            expect(productImage.imageID).toBe(imageID);
        });
    });

    describe("updateImage", () => {
        test("should throw ResourceNotFoundError if the product is not found", async () => {
            const productID = "7";
            const imageID = "101";
            const imageData = { url: "https://example.com/image.jpg" };

            await expect(
                productImageService.updateImage(productID, imageID, imageData)
            ).rejects.toThrow(ResourceNotFoundError);
        });

        test("should throw ResourceNotFoundError if the image is not found", async () => {
            const productID = "2";
            const imageID = "111";
            const imageData = { url: "https://example.com/image.jpg" };

            await expect(
                productImageService.updateImage(productID, imageID, imageData)
            ).rejects.toThrow(ResourceNotFoundError);
        });

        test("should update the image data and return the updated image", async () => {
            const productID = "1";
            const imageID = "101";
            const imageData = {
                url: "https://example.com/new-image.jpg",
            };

            const updatedImage = await productImageService.updateImage(
                productID,
                imageID,
                imageData
            );

            expect(updatedImage).toBeInstanceOf(ProductImage);
            expect(updatedImage.productID).toBe(productID);
            expect(updatedImage.imageID).toBe(imageID);
            expect(updatedImage.url).toBe(imageData.url);
        });
    });

    describe("deleteImage", () => {
        test("should throw ResourceNotFoundError if the product is not found", async () => {
            const productID = "7";
            const imageID = "201";

            await expect(
                productImageService.deleteImage(productID, imageID)
            ).rejects.toThrow(ResourceNotFoundError);
        });

        test("should throw ResourceNotFoundError if the image is not found", async () => {
            const productID = "2";
            const imageID = "111";

            await expect(
                productImageService.deleteImage(productID, imageID)
            ).rejects.toThrow(ResourceNotFoundError);
        });

        test("should delete the image with the given productID and imageID", async () => {
            const productID = "2";
            const imageID = "201";

            await productImageService.deleteImage(productID, imageID);

            await expect(
                productImageService.getProductImage(productID, imageID)
            ).rejects.toThrow(ResourceNotFoundError);
        });
    });

    describe("getProductImages", () => {
        test("should throw ResourceNotFoundError if the product is not found", async () => {
            const productID = "7";

            await expect(
                productImageService.getProductImages(productID)
            ).rejects.toThrow(ResourceNotFoundError);
        });

        test("should return an array of product images if the product exists", async () => {
            const productID = "1";

            const productImages = await productImageService.getProductImages(
                productID
            );

            expect(productImages).toBeInstanceOf(Array);
            expect(productImages.length).toBeGreaterThan(0);
            expect(productImages[0]).toBeInstanceOf(ProductImage);
            expect(productImages[0].productID).toBe(productID);
        });
    });

    describe("setImagesOrder", () => {
        test("should throw ResourceNotFoundError if the product is not found", async () => {
            const productID = "7";
            const imagesData = [
                { imageID: "101", displayOrder: 1 },
                { imageID: "102", displayOrder: 2 },
                { imageID: "103", displayOrder: 3 },
                { imageID: "104", displayOrder: 4 },
            ];

            await expect(
                productImageService.setImagesOrder(productID, imagesData)
            ).rejects.toThrow(ResourceNotFoundError);
        });

        test("should throw ResourceNotFoundError if any of the images is not found", async () => {
            const productID = "1";
            const imagesData = [
                { imageID: "101", displayOrder: 1 },
                { imageID: "601", displayOrder: 2 },
                { imageID: "103", displayOrder: 3 },
                { imageID: "104", displayOrder: 4 },
            ];

            await expect(
                productImageService.setImagesOrder(productID, imagesData)
            ).rejects.toThrow(ResourceNotFoundError);
        });

        test("should update the display order of the images and return the updated images", async () => {
            const productID = "1";
            const imagesData = [
                { imageID: "101", displayOrder: 3 },
                { imageID: "102", displayOrder: 4 },
                { imageID: "103", displayOrder: 2 },
                { imageID: "104", displayOrder: 1 },
            ];

            const updatedImages = await productImageService.setImagesOrder(
                productID,
                imagesData
            );

            expect(updatedImages).toBeInstanceOf(Array);
            expect(updatedImages.length).toBe(imagesData.length);

            for (let i = 0; i < updatedImages.length; i++) {
                const { imageID, displayOrder } = imagesData[i];
                const updatedImage = updatedImages.find(
                    (image) => image.imageID === imageID
                );

                expect(updatedImage).toBeInstanceOf(ProductImage);
                expect(updatedImage.productID).toBe(productID);
                expect(updatedImage.imageID).toBe(imageID);
                expect(updatedImage.displayOrder).toBe(displayOrder);
            }
        });
    });
});
