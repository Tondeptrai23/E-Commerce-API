import { StatusCodes } from "http-status-codes";
import { ResourceNotFoundError } from "../../utils/error.js";
import productImageService from "../../services/products/productImage.service.js";
import productBuilderService from "../../services/products/productBuilder.service.js";
import ImageSerializer from "../../services/serializers/imageSerializer.service.js";

class ProductImageController {
    async getProductImages(req, res) {
        try {
            // Get request body
            const { productID } = req.params;

            // Call services
            let images = await productImageService.getProductImages(productID);

            // Serialize data
            let serializer;
            if (req.admin !== undefined) {
                serializer = new ImageSerializer({
                    includeTimestamps: true,
                    includeForeignKeys: false,
                });
            } else {
                serializer = new ImageSerializer({
                    includeTimestamps: false,
                    includeForeignKeys: false,
                });
            }
            images = images.map((image) => serializer.serialize(image));

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                images: images,
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
            const serializer = new ImageSerializer({
                includeTimestamps: false,
                includeForeignKeys: false,
            });
            const serializedImages = product.images.map((image) =>
                serializer.serialize(image)
            );

            // Response
            const response = {
                success: true,
                images: serializedImages,
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
            let image = await productImageService.updateImage(
                productID,
                imageID,
                {
                    url,
                    thumbnail,
                }
            );

            // Serialize data
            const serializer = new ImageSerializer({
                includeTimestamps: false,
                includeForeignKeys: false,
            });
            image = serializer.serialize(image);

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                image: image,
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

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
                images: updatedImages,
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
