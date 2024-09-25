import { db } from "../../models/index.model.js";
import Product from "../../models/products/product.model.js";
import ProductImage from "../../models/products/productImage.model.js";
import { BadRequestError, ResourceNotFoundError } from "../../utils/error.js";
import { awsConfig } from "../../config/config.js";
import { getExtensionByContentType } from "../../utils/utils.js";
import { s3, cloudfront } from "../../config/aws.config.js";

class ImageService {
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
                required: false,
                where: {
                    imageID: imageID,
                },
            },
        });

        if (!product) {
            throw new ResourceNotFoundError("Product not found");
        }

        if (!product.images || product.images.length === 0) {
            throw new ResourceNotFoundError("Image not found");
        }

        return product.images[0];
    }

    /**
     * Update an image with the given productID and imageID
     *
     * @param {String} productID the product ID to be updated
     * @param {String} imageID the image ID to be updated
     * @param {Object} image the image to be updated
     * @returns {Promise<ProductImage>} the updated image
     */
    async updateImage(productID, imageID, image) {
        let oldImage = await this.getProductImage(productID, imageID);

        return await db
            .transaction(async (t) => {
                oldImage = await oldImage.update({
                    contentType: image.mimetype,
                });

                await this.uploadImage(
                    oldImage.imageID,
                    image.buffer,
                    image.mimetype
                );

                return oldImage;
            })
            .catch((error) => {
                throw error;
            });
    }

    /**
     * Delete an image with the given productID and imageID
     *
     * @param {String} productID the product ID to be updated
     * @param {String} imageID the image ID to be updated
     * @throws {ResourceNotFoundError} if the product or image is not found
     * @throws {BadRequestError} if the image is the last image of the product
     */
    async deleteImage(productID, imageID) {
        const images = await ProductImage.findAll({
            where: {
                productID: productID,
            },
            order: [["displayOrder", "ASC"]],
        });

        if (images.length === 0) {
            throw new ResourceNotFoundError("Product not found");
        }

        const imageIndex = images.findIndex(
            (image) => image.imageID === imageID
        );
        if (imageIndex === -1) {
            throw new ResourceNotFoundError("Image not found");
        }

        if (images.length === 1) {
            throw new BadRequestError("Cannot delete the last image");
        }

        return await db
            .transaction(async (t) => {
                await s3
                    .deleteObject({
                        Bucket: awsConfig.BUCKET_NAME,
                        Key: images[imageIndex].fileName,
                    })
                    .promise();

                await images[imageIndex].destroy();

                // Update display order for remaining images
                for (let i = imageIndex + 1; i < images.length; i++) {
                    images[i].displayOrder = i;
                    await images[i].save();
                }
            })
            .catch((error) => {
                throw error;
            });
    }

    /**
     * Get all images of a product
     *
     * @param {String} productID the product ID to be retrieved
     * @returns {Promise<ProductImage[]>} the images of the product
     * @throws {ResourceNotFoundError} if the product is not found
     */
    async getProductImages(productID, options = { includeDeleted: false }) {
        const product = await Product.findByPk(productID, {
            include: [
                {
                    model: ProductImage,
                    as: "images",
                },
            ],
            paranoid: !options.includeDeleted,
        });
        if (!product) {
            throw new ResourceNotFoundError("Product not found");
        }

        const images = product.images;
        return images;
    }

    /**
     * Set the display order of the images of a product
     *
     * @param {String} productID the product ID to be updated
     * @param {Array<Object>} imageIDs the image IDs to be updated
     * @returns {Promise<ProductImage[]>} the updated images
     * @throws {ResourceNotFoundError} if the product or image is not found
     *
     */
    async setImagesOrder(productID, imageIDs) {
        const oldImages = await this.getProductImages(productID);

        const size = imageIDs ? imageIDs.length : 0;

        const foundImages = [];
        // Find images by ID and update their display order
        for (let i = 0; i < size; i++) {
            const imageID = imageIDs[i];
            const image = oldImages.find((image) => image.imageID === imageID);

            if (!image) {
                throw new ResourceNotFoundError("Image not found");
            }

            image.displayOrder = i + 1;
            foundImages.push(image);
        }

        // Update display order for remaining images
        let newDisplayOrder = foundImages.length + 1;
        for (const image of oldImages) {
            if (!foundImages.includes(image)) {
                image.displayOrder = newDisplayOrder++;
            }
        }

        return await db
            .transaction(async (t) => {
                // Only update the images if all images are found
                return await Promise.all(
                    oldImages.map(async (image) => await image.save())
                );
            })
            .catch((error) => {
                throw error;
            });
    }

    /**
     * Sign a URL for a product image
     *
     * @param {ProductImage} image the image to be signed
     * @returns {String} the signed URL
     */
    signImageURL(image) {
        if (!image) {
            return null;
        }

        const signedURL = cloudfront.getSignedUrl({
            url: `${awsConfig.CLOUDFRONT_URL}/${
                image.imageID
            }.${getExtensionByContentType(image.contentType)}`,

            expires: Math.floor(Date.now() / 1000) + 60 * 60,

            headers: {
                "Content-Type": image.contentType,
            },
        });

        return signedURL;
    }

    /**
     * Upload an image to S3
     *
     * @param {String} fileName the name of the file
     * @param {Buffer} buffer the buffer of the image
     * @param {String} contentType the content type of the image
     * @returns {Promise<void>}
     */
    async uploadImage(fileName, buffer, contentType) {
        await s3
            .putObject({
                Bucket: awsConfig.BUCKET_NAME,
                Key: `${fileName}.${getExtensionByContentType(contentType)}`,
                Body: buffer,
                ContentType: contentType,
            })
            .promise();
    }
}

export default new ImageService();
