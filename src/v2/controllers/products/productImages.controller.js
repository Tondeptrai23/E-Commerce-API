import { StatusCodes } from "http-status-codes";
import { ResourceNotFoundError, BadRequestError } from "../../utils/error.js";
import productImageService from "../../services/products/productImage.service.js";
import productBuilderService from "../../services/products/productBuilder.service.js";
import ImageSerializer from "../../services/serializers/image.serializer.service.js";

class ProductImageController {
    async getProductImages(req, res) {
        try {
            // Get request body
            const { productID } = req.params;
            const isAdmin = req.admin ? true : false;

            // Call services
            const images = await productImageService.getProductImages(
                productID,
                {
                    includeDeleted: isAdmin,
                }
            );

            // Serialize data
            const serializedImages = ImageSerializer.parse(images, {
                includeTimestamps: isAdmin,
            });

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                images: serializedImages,
            });
        } catch (err) {
            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    errors: [
                        {
                            error: "NotFound",
                            message: err.message,
                        },
                    ],
                });
            } else {
                console.log(err);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    errors: [
                        {
                            error: "ServerError",
                            message: "Server error when get product images",
                        },
                    ],
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
            const serializedImages = ImageSerializer.parse(product.images, {
                includeTimestamps: true,
            });

            // Response
            res.status(StatusCodes.CREATED).json({
                success: true,
                images: serializedImages,
            });
        } catch (err) {
            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    errors: [
                        {
                            error: "NotFound",
                            message: err.message,
                        },
                    ],
                });
            } else {
                console.log(err);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    errors: [
                        {
                            error: "ServerError",
                            message: "Server error when add product images",
                        },
                    ],
                });
            }
        }
    }

    async updateProductImage(req, res) {
        try {
            // Get request body
            const { productID } = req.params;
            const { imageID } = req.params;
            const { url, altText } = req.body;

            // Call services
            const image = await productImageService.updateImage(
                productID,
                imageID,
                {
                    url,
                    altText,
                }
            );

            // Serialize data
            const serializedImage = ImageSerializer.parse(image, {
                includeTimestamps: true,
            });

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                image: serializedImage,
            });
        } catch (err) {
            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    errors: [
                        {
                            error: "NotFound",
                            message: err.message,
                        },
                    ],
                });
            } else {
                console.log(err);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    errors: [
                        {
                            error: "ServerError",
                            message: "Server error when update a product image",
                        },
                    ],
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
            const serializedImages = ImageSerializer.parse(updatedImages, {
                includeTimestamps: true,
            });

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                images: serializedImages,
            });
        } catch (err) {
            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    errors: [
                        {
                            error: "NotFound",
                            message: err.message,
                        },
                    ],
                });
            } else {
                console.log(err);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    errors: [
                        {
                            error: "ServerError",
                            message: "Server error when set images order",
                        },
                    ],
                });
            }
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
            if (err instanceof ResourceNotFoundError) {
                res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    errors: [
                        {
                            error: "NotFound",
                            message: err.message,
                        },
                    ],
                });
            } else if (err instanceof BadRequestError) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    errors: [
                        {
                            error: "BadRequest",
                            message: err.message,
                        },
                    ],
                });
            } else {
                console.log(err);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    errors: [
                        {
                            error: "ServerError",
                            message: "Server error when delete a product image",
                        },
                    ],
                });
            }
        }
    }
}

export default new ProductImageController();
