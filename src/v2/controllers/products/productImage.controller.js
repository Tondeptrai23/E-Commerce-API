import { StatusCodes } from "http-status-codes";
import { ResourceNotFoundError } from "../../utils/error.js";
import productImageService from "../../services/products/productImage.service.js";
import productBuilderService from "../../services/products/productBuilder.service.js";
import ImageSerializer from "../../services/serializers/image.serializer.service.js";

class ProductImageController {
    async getProductImages(req, res) {
        try {
            // Get request body
            const { productID } = req.params;

            // Call services
            const images = await productImageService.getProductImages(
                productID
            );

            // Serialize data
            const serializedImages = ImageSerializer.serialize(images, {
                includeTimestamps: req.admin ? true : false,
            });

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                data: {
                    images: serializedImages,
                },
            });
        } catch (err) {
            console.log(err);

            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    error: err.message,
                });
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    error: "Server error when get product images",
                });
            }
        }
    }

    async addProductImages(req, res) {
        try {
            // Get request body
            const { productID } = req.params;
            const { images } = req.body;

            // Call services
            const product = await productBuilderService.addImages(
                productID,
                images
            );

            // Serialize data
            const serializedImages = ImageSerializer.serialize(product.images, {
                includeTimestamps: true,
            });

            // Response
            const response = {
                success: true,
                data: {
                    images: serializedImages,
                },
            };
            res.status(StatusCodes.CREATED).json(response);
        } catch (err) {
            console.log(err);

            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    error: err.message,
                });
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    error: "Server error when add a product image",
                });
            }
        }
    }

    async updateProductImage(req, res) {
        try {
            // Get request body
            const { productID } = req.params;
            const { imageID } = req.params;
            const { url, thumbnail } = req.body;

            // Call services
            const image = await productImageService.updateImage(
                productID,
                imageID,
                {
                    url,
                    thumbnail,
                }
            );

            // Serialize data
            const serializedImage = ImageSerializer.serialize(image, {
                includeTimestamps: true,
            });

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                data: {
                    image: serializedImage,
                },
            });
        } catch (err) {
            console.log(err);

            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    error: err.message,
                });
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    error: "Server error when update a product image",
                });
            }
        }
    }

    async setImagesOrder(req, res) {
        try {
            // Get request body
            const { productID } = req.params;
            const { images } = req.body;

            // Call services
            const updatedImages = await productImageService.setImagesOrder(
                productID,
                images
            );

            // Serialize data
            const serializedImages = ImageSerializer.serialize(updatedImages, {
                includeTimestamps: true,
            });

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                data: {
                    images: serializedImages,
                },
            });
        } catch (err) {
            console.log(err);
        }
    }

    async deleteProductImage(req, res) {
        try {
            // Get request body
            const { productID } = req.params;
            const { imageID } = req.params;

            // Call services
            await productImageService.deleteImage(productID, imageID);

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
            });
        } catch (err) {
            console.log(err);

            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    error: err.message,
                });
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    error: "Server error when delete a product image",
                });
            }
        }
    }
}

export default new ProductImageController();
