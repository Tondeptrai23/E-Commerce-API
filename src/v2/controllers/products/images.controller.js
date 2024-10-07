import { StatusCodes } from "http-status-codes";
import imageService from "../../services/products/image.service.js";
import productBuilderService from "../../services/products/productBuilder.service.js";
import ImageSerializer from "../../services/serializers/image.serializer.service.js";

class ImageController {
    async getProductImages(req, res, next) {
        try {
            // Get request body
            const { productID } = req.params;
            const isAdmin = req.admin ? true : false;

            // Call services
            const images = await imageService.getProductImages(productID, {
                includeDeleted: isAdmin,
            });

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
            next(err);
        }
    }

    async addProductImages(req, res, next) {
        try {
            // Get request body
            const { productID } = req.params;
            const images = req.files;

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
            next(err);
        }
    }

    async replaceProductImage(req, res, next) {
        try {
            // Get request body
            const { productID } = req.params;
            const { imageID } = req.params;

            // Call services
            const image = await imageService.updateImage(
                productID,
                imageID,
                req.file
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
            next(err);
        }
    }

    async setImagesOrder(req, res, next) {
        try {
            // Get request body
            const { productID } = req.params;
            const { images } = req.body;

            // Call services
            const updatedImages = await imageService.setImagesOrder(
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
            next(err);
        }
    }

    async deleteProductImage(req, res, next) {
        try {
            // Get request body
            const { productID } = req.params;
            const { imageID } = req.params;

            // Call services
            await imageService.deleteImage(productID, imageID);

            // Response
            res.status(StatusCodes.OK).json({
                success: true,
            });
        } catch (err) {
            next(err);
        }
    }
}

export default new ImageController();
