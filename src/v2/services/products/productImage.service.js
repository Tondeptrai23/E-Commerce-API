import { Product } from "../../models/products/product.model.js";
import { ProductImage } from "../../models/products/productImage.model.js";
import { ResourceNotFoundError } from "../../utils/error.js";

class ProductImageService {
    /**
     * Get a product image
     *
     * @param {String} productID the product ID to be retrieved
     * @param {String} imageID the image ID to be retrieved
     * @returns {Promise<ProductImage>} the image of the product
     * @throws {ResourceNotFoundError} if the product or image is not found
     */
    async getProductImage(productID, imageID) {
        const product = await Product.findByPk(productID, {
            include: {
                model: ProductImage,
                as: "images",
                where: {
                    imageID: imageID,
                },
            },
        });
        if (!product) {
            throw new ResourceNotFoundError("Product or Image not found");
        }

        return product.images[0];
    }

    /**
     * Update the images of a product
     *
     * @param {String} productID the product ID to be updated
     * @param {String} imageID the image ID to be updated
     * @param {Object} imageData the image data to be updated
     * @returns {Promise<ProductImage>} the updated image
     * @throws {ResourceNotFoundError} if the product or image is not found
     */
    async updateImage(productID, imageID, imageData) {
        const image = await this.getProductImage(productID, imageID);
        await image.update(imageData);
        return image;
    }

    /**
     * Delete an image with the given productID and imageID
     *
     * @param {String} productID the product ID to be updated
     * @param {String} imageID the image ID to be updated
     * @throws {ResourceNotFoundError} if the product or image is not found
     */
    async deleteImage(productID, imageID) {
        const image = await this.getProductImage(productID, imageID);
        await image.destroy();
    }

    /**
     * Get all images of a product
     *
     * @param {String} productID the product ID to be retrieved
     * @returns {Promise<ProductImage[]>} the images of the product
     * @throws {ResourceNotFoundError} if the product is not found
     */
    async getProductImages(productID) {
        const product = await Product.findByPk(productID, {
            include: [
                {
                    model: ProductImage,
                    as: "images",
                },
            ],
        });
        if (!product) {
            throw new ResourceNotFoundError("Product not found");
        }

        const images = product.images;
        return images;
    }
}

export default new ProductImageService();
