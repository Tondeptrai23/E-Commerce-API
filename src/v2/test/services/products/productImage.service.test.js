import productImageService from "../../../services/products/productImage.service.js";
import seedData from "../../../seedData.js";
import { ProductImage } from "../../../models/products/productImage.model.js";
import { ResourceNotFoundError } from "../../../utils/error.js";

beforeAll(async () => {
    await seedData();
});

describe("ProductImageService", () => {
    describe("getProductImage", () => {
        test("should throw ResourceNotFoundError if the product is not found", async () => {
            const productID = "7";
            const imageID = "1";

            await expect(
                productImageService.getProductImage(productID, imageID)
            ).rejects.toThrow(ResourceNotFoundError);
        });

        test("should throw ResourceNotFoundError if the image is not found", async () => {
            const productID = "2";
            const imageID = "1";

            await expect(
                productImageService.getProductImage(productID, imageID)
            ).rejects.toThrow(ResourceNotFoundError);
        });

        test("should return the image of the product if both product and image exist", async () => {
            const productID = "1";
            const imageID = "1";

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
            const imageID = "1";
            const imageData = { imagePath: "https://example.com/image.jpg" };

            await expect(
                productImageService.updateImage(productID, imageID, imageData)
            ).rejects.toThrow(ResourceNotFoundError);
        });

        test("should throw ResourceNotFoundError if the image is not found", async () => {
            const productID = "2";
            const imageID = "1";
            const imageData = { imagePath: "https://example.com/image.jpg" };

            await expect(
                productImageService.updateImage(productID, imageID, imageData)
            ).rejects.toThrow(ResourceNotFoundError);
        });

        test("should update the image data and return the updated image", async () => {
            const productID = "1";
            const imageID = "1";
            const imageData = {
                imagePath: "https://example.com/new-image.jpg",
            };

            const updatedImage = await productImageService.updateImage(
                productID,
                imageID,
                imageData
            );

            expect(updatedImage).toBeInstanceOf(ProductImage);
            expect(updatedImage.productID).toBe(productID);
            expect(updatedImage.imageID).toBe(imageID);
            expect(updatedImage.imagePath).toBe(imageData.imagePath);
        });
    });

    describe("deleteImage", () => {
        test("should throw ResourceNotFoundError if the product is not found", async () => {
            const productID = "7";
            const imageID = "1";

            await expect(
                productImageService.deleteImage(productID, imageID)
            ).rejects.toThrow(ResourceNotFoundError);
        });

        test("should throw ResourceNotFoundError if the image is not found", async () => {
            const productID = "2";
            const imageID = "1";

            await expect(
                productImageService.deleteImage(productID, imageID)
            ).rejects.toThrow(ResourceNotFoundError);
        });

        test("should delete the image with the given productID and imageID", async () => {
            const productID = "1";
            const imageID = "1";

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
});
