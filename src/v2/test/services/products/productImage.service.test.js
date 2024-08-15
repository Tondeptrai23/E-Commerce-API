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

            const images = await productImageService.getProductImages(
                productID
            );
            await productImageService.deleteImage(productID, imageID);

            // Check if the image is deleted
            await expect(
                productImageService.getProductImage(productID, imageID)
            ).rejects.toThrow(ResourceNotFoundError);

            // Check if the display order is updated
            const updatedImages = await productImageService.getProductImages(
                productID
            );
            expect(updatedImages.length).toBe(images.length - 1);
            expect(updatedImages.every((image) => image.displayOrder > 0)).toBe(
                true
            );
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
            const imagesData = ["102", "604", "101", "103"];

            await expect(
                productImageService.setImagesOrder(productID, imagesData)
            ).rejects.toThrow(ResourceNotFoundError);
        });

        test("should throw ResourceNotFoundError and not update order if any of the images is not found", async () => {
            const productID = "1";
            const imagesData = ["102", "604", "101", "103"];

            const productImages = await productImageService.getProductImages(
                productID
            );

            await expect(
                productImageService.setImagesOrder(productID, imagesData)
            ).rejects.toThrow(ResourceNotFoundError);

            const updatedImages = await productImageService.getProductImages(
                productID
            );

            for (let i = 0; i < productImages.length; i++) {
                expect(updatedImages[i].displayOrder).toBe(
                    productImages[i].displayOrder
                );
            }
        });

        test("should update the display order of the images and return the updated images", async () => {
            const productID = "1";
            const imagesData = ["102", "104", "101", "103"];

            const updatedImages = await productImageService.setImagesOrder(
                productID,
                imagesData
            );

            expect(updatedImages).toBeInstanceOf(Array);
            expect(updatedImages.length).toBe(imagesData.length);

            for (let i = 0; i < updatedImages.length; i++) {
                const imageID = imagesData[i];
                const updatedImage = updatedImages.find(
                    (image) => image.imageID === imageID
                );

                expect(updatedImage).toBeInstanceOf(ProductImage);
                expect(updatedImage.productID).toBe(productID);
                expect(updatedImage.imageID).toBe(imageID);
                expect(updatedImage.displayOrder).toBe(i + 1);
            }
        });
    });
});
