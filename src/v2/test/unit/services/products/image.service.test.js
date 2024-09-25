import imageService from "../../../../services/products/image.service.js";
import seedData from "../../../../seedData.js";
import ProductImage from "../../../../models/products/productImage.model.js";
import { ResourceNotFoundError } from "../../../../utils/error.js";
import { BadRequestError } from "../../../../utils/error.js";
import { jest } from "@jest/globals";
import { s3 } from "../../../../config/aws.config.js";

beforeAll(async () => {
    await seedData();

    jest.spyOn(s3, "deleteObject").mockImplementation(() => {
        return {
            promise: jest.fn().mockResolvedValue(),
        };
    });

    jest.spyOn(s3, "putObject").mockImplementation(() => {
        return {
            promise: jest.fn().mockResolvedValue(),
        };
    });
}, 15000);

afterAll(() => {
    jest.restoreAllMocks();
});

describe("imageService", () => {
    describe("getProductImage", () => {
        test("should throw ResourceNotFoundError if the product is not found", async () => {
            const productID = "7";
            const imageID = "101";

            await expect(
                imageService.getProductImage(productID, imageID)
            ).rejects.toThrow(ResourceNotFoundError);
        });

        test("should throw ResourceNotFoundError if the image is not found", async () => {
            const productID = "2";
            const imageID = "111";

            await expect(
                imageService.getProductImage(productID, imageID)
            ).rejects.toThrow(ResourceNotFoundError);
        });

        test("should return the image of the product if both product and image exist", async () => {
            const productID = "1";
            const imageID = "101";

            const productImage = await imageService.getProductImage(
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
                imageService.updateImage(productID, imageID, imageData)
            ).rejects.toThrow(ResourceNotFoundError);
        });

        test("should throw ResourceNotFoundError if the image is not found", async () => {
            const productID = "2";
            const imageID = "111";
            const imageData = { url: "https://example.com/image.jpg" };

            await expect(
                imageService.updateImage(productID, imageID, imageData)
            ).rejects.toThrow(ResourceNotFoundError);
        });

        test("should update the image data and return the updated image", async () => {
            const productID = "1";
            const imageID = "101";
            const imageData = {
                mimetype: "image/bmp",
            };

            const updatedImage = await imageService.updateImage(
                productID,
                imageID,
                imageData
            );

            expect(updatedImage).toBeInstanceOf(ProductImage);
            expect(updatedImage.productID).toBe(productID);
            expect(updatedImage.imageID).toBe(imageID);
            expect(updatedImage.contentType).toBe(imageData.mimetype);
        });
    });

    describe("deleteImage", () => {
        test("should throw ResourceNotFoundError if the product is not found", async () => {
            const productID = "7";
            const imageID = "201";

            await expect(
                imageService.deleteImage(productID, imageID)
            ).rejects.toThrow(ResourceNotFoundError);
        });

        test("should throw ResourceNotFoundError if the image is not found", async () => {
            const productID = "2";
            const imageID = "111";

            await expect(
                imageService.deleteImage(productID, imageID)
            ).rejects.toThrow(ResourceNotFoundError);
        });

        test("should delete the image with the given productID and imageID", async () => {
            const productID = "2";
            const imageID = "201";

            const images = await imageService.getProductImages(productID);
            await imageService.deleteImage(productID, imageID);

            // Check if the image is deleted
            await expect(
                imageService.getProductImage(productID, imageID)
            ).rejects.toThrow(ResourceNotFoundError);

            // Check if the display order is updated
            const updatedImages = await imageService.getProductImages(
                productID
            );
            expect(updatedImages.length).toBe(images.length - 1);
            expect(updatedImages.every((image) => image.displayOrder > 0)).toBe(
                true
            );
        });

        test("should throw BadRequestError if the image is the last image of the product", async () => {
            const productID = "2";

            const images = await ProductImage.findAll({
                where: { productID },
                order: [["displayOrder", "ASC"]],
            });

            for (let i = 0; i < images.length - 1; i++) {
                await imageService.deleteImage(productID, images[i].imageID);
            }

            await expect(
                imageService.deleteImage(
                    productID,
                    images[images.length - 1].imageID
                )
            ).rejects.toThrow(BadRequestError);
        });

        test("should not delete the image if something goes wrong", async () => {
            const productID = "3";

            const images = await ProductImage.findAll({
                where: { productID },
                order: [["displayOrder", "ASC"]],
            });

            jest.spyOn(images[1], "save").mockImplementation(() => {
                throw new Error();
            });

            jest.spyOn(ProductImage, "findAll").mockImplementation(() => {
                return images;
            });

            await expect(
                imageService.deleteImage(productID, images[0].imageID)
            ).rejects.toThrow();

            jest.restoreAllMocks();

            const updatedImages = await imageService.getProductImages(
                productID
            );
            expect(updatedImages.length).toBe(images.length);
        });
    });

    describe("getProductImages", () => {
        test("should throw ResourceNotFoundError if the product is not found", async () => {
            const productID = "7";

            await expect(
                imageService.getProductImages(productID)
            ).rejects.toThrow(ResourceNotFoundError);
        });

        test("should return an array of product images if the product exists", async () => {
            const productID = "1";

            const productImages = await imageService.getProductImages(
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
                imageService.setImagesOrder(productID, imagesData)
            ).rejects.toThrow(ResourceNotFoundError);
        });

        test("should throw ResourceNotFoundError and not update order if any of the images is not found", async () => {
            const productID = "1";
            const imagesData = ["102", "604", "101", "103"];

            const productImages = await imageService.getProductImages(
                productID
            );

            await expect(
                imageService.setImagesOrder(productID, imagesData)
            ).rejects.toThrow(ResourceNotFoundError);

            const updatedImages = await imageService.getProductImages(
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

            const updatedImages = await imageService.setImagesOrder(
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
