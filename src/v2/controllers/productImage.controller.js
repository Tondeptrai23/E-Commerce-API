import { StatusCodes } from "http-status-codes";
import { ResourceNotFoundError } from "../utils/error.js";
import productImageService from "../services/products/productImage.service.js";
import productBuilderService from "../services/products/productBuilder.service.js";

class ProductImageController {
    async getProductImages(req, res) {
        try {
            const { productID } = req.params;

            const images = await productImageService.getProductImages(
                productID
            );

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
            const { productID } = req.params;
            const { images } = req.body;
            const { includeProduct } = req.query;

            const product = await productBuilderService.addImages(
                productID,
                images
            );

            let response;
            if (includeProduct === "true") {
                response = {
                    success: true,
                    product: product,
                };
            } else {
                response = {
                    success: true,
                    images: product.images,
                };
            }
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
            const { productID } = req.params;
            const { imageID } = req.params;
            const { imagePath, displayOrder } = req.body;

            const product = await productImageService.updateImage(
                productID,
                imageID,
                {
                    imagePath,
                    displayOrder,
                }
            );

            res.status(StatusCodes.OK).json({
                success: true,
                product: product,
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

    async deleteProductImage(req, res) {
        try {
            const { productID } = req.params;
            const { imageURLID } = req.params;

            await productImageService.deleteImage(productID, imageURLID);

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
