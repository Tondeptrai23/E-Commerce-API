import { Product } from "../../models/products/product.model.js";
import { Category } from "../../models/products/category.model.js";
import { Op } from "sequelize";
import { removeEmptyFields } from "../../utils/utils.js";
import variantService from "./variant.service.js";
import { ResourceNotFoundError } from "../../utils/error.js";
import { Variant } from "../../models/products/variant.model.js";
import { db } from "../../models/index.js";

class ProductBuilderService {
    /**
     * Create a product builder object that can be used to create a product
     * or add variants, categories, and images to an existing product.
     *
     * @param {String} productID the product ID to be retrieved
     * @returns {Promise<Object>} the product builder object
     * @throws {ResourceNotFoundError} if the productID is provided but the product is not found
     */
    async productBuilder(productID = null) {
        let product = null;
        if (productID) {
            product = await Product.findByPk(productID);
            if (!product) {
                throw new ResourceNotFoundError("Product not found");
            }
        }

        return {
            product: product,
            variants: null,
            categories: null,
            images: null,

            /**
             * Set the product info for the product builder
             * Should be called first when creating a new product
             *
             * @param {Object} productInfo the product info to be set
             * @returns {Promise<Object>} this product builder object
             */
            async setProductInfo(productInfo) {
                if (!productInfo) {
                    return this;
                }

                const productData = await Product.create(productInfo);
                this.product = productData;
                return this;
            },

            /**
             * Set the variants for the product builder
             *
             * @param {Array<Object>} variants the variants info to be set
             * @returns {Promise<Object>} this product builder object
             */
            async setVariants(variants) {
                if (!variants) {
                    return this;
                }

                for (let i = 0; i < variants.length; i++) {
                    variants[i] = await variantService.createVariantForProduct(
                        this.product,
                        variants[i]
                    );
                }

                this.variants = variants;
                return this;
            },

            /**
             * Set the categories for the product builder
             *
             * @param {Array<String>} categories the array of category names to be set
             * @returns {Promise<Object>} this product builder object
             */
            async setCategories(categories) {
                if (!categories) {
                    return this;
                }
                const categoriesObj = await Category.findAll({
                    where: {
                        name: {
                            [Op.in]: categories,
                        },
                    },
                });
                this.categories = categoriesObj;
                await this.product.addCategories(categoriesObj);

                return this;
            },

            /**
             * Set the images for the product builder
             *
             * @param {Array<Object>} images the images to be set
             * @returns {Promise<Object>} this product builder object
             */
            async setImages(images) {
                if (!images) {
                    return this;
                }
                for (let i = 0; i < images.length; i++) {
                    images[i] = await this.product.createImage(images[i]);
                }
                this.images = images;
                return this;
            },

            /**
             * Set the default variant for the product builder
             * The default variant is the first variant in the variants array
             * Only call this method after calling setVariants and when create a new product
             *
             * @returns {Promise<Object>} this product builder object
             */
            async setDefaultVariant() {
                const variant = await Variant.findByPk(
                    this.variants[0].variantID,
                    {
                        include: [
                            {
                                model: Product,
                                as: "product",
                            },
                        ],
                    }
                );

                await db.query(
                    "UPDATE `products` SET `defaultVariantID`=?,`updatedAt`=? WHERE `productID` = ?",
                    {
                        replacements: [
                            variant.variantID,
                            new Date(),
                            this.product.productID,
                        ],
                    }
                );
                this.product.dataValues.defaultVariantID = variant.variantID;

                // TODO: This code is not working as expected but the above code is working. Fix this code
                //
                // await this.product.setDefaultVariant(variant);
                return this;
            },

            /**
             * Build the product object
             * Should be called last
             *
             * @returns {Promise<Object>} the product builder object
             */
            async build() {
                let result = {
                    ...JSON.parse(JSON.stringify(this.product)),
                    variants: this.variants,
                    images: this.images,
                    categories: this.categories,
                };

                result = removeEmptyFields(result);

                return result;
            },
        };
    }

    /**
     * Create a new product with the given info
     *
     * @param {Object} productInfo the product info to be set
     * @param {Array<Object>} variants the variants info to be set
     * @param {Array<String>} categories the array of category names to be set
     * @param {Array<Object>} images the images info to be set
     * @returns {Promise<Product>} the product object
     * @throws {ResourceNotFoundError} if the product is not found
     *
     */
    async addProduct(productInfo, variants, categories, images) {
        let builder = await this.productBuilder();
        builder = await builder.setProductInfo(productInfo);
        builder = await builder.setVariants(variants);
        builder = await builder.setCategories(categories);
        builder = await builder.setImages(images);
        builder = await builder.setDefaultVariant();
        return await builder.build();
    }

    /**
     * Add an image to a product
     *
     * @param {String} productID the product ID to be updated
     * @param {Object} imageData the image data to be added
     * @returns {Promise<Product>} the product with the new image added
     * @throws {ResourceNotFoundError} if the product is not found
     */
    async addImages(productID, imagesData) {
        let builder = await this.productBuilder(productID);
        builder = await builder.setImages(imagesData);
        const product = await builder.build();

        return product;
    }

    /**
     * Add a variant to a product
     *
     * @param {String} productID the product ID to be updated
     * @param {Object} variants the variants to be added
     * @returns {Promise<Product>} the product with the new variants added
     * @throws {ResourceNotFoundError} if the product is not found
     */
    async addVariants(productID, variants) {
        let builder = await this.productBuilder(productID);
        builder = await builder.setVariants(variants);
        const product = await builder.build();

        return product;
    }

    /**
     * Add the categories to a product
     *
     * @param {String} productID the product ID to be updated
     * @param {Array<String>} categories the array of category names to be set
     * @returns {Promise<Product>} the updated product
     * @throws {ResourceNotFoundError} if the product is not found
     */
    async addCategories(productID, categories) {
        const builder = await this.productBuilder(productID);
        await builder.setCategories(categories);
        const product = await builder.build();

        return product;
    }
}

export default new ProductBuilderService();
