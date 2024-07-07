import { Product } from "../../models/products/product.model.js";
import { Category } from "../../models/products/category.model.js";
import { Op } from "sequelize";
import { removeEmptyFields } from "../../utils/utils.js";

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
            imageURLs: null,

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
                    variants[i] = await this.product.createVariant(variants[i]);
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
             * @param {Array<Object>} imageURLs the image URLs to be set
             * @returns {Promise<Object>} this product builder object
             */
            async setImages(imageURLs) {
                if (!imageURLs) {
                    return this;
                }
                for (let i = 0; i < imageURLs.length; i++) {
                    imageURLs[i] = await this.product.createProductImage(
                        imageURLs[i]
                    );
                }
                this.imageURLs = imageURLs;
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
                await this.product.update({
                    defaultVariantID: this.variants[0].variantID,
                });
                await this.product.save();
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
                    variants: JSON.parse(JSON.stringify(this.variants)),
                    imageURLs: JSON.parse(JSON.stringify(this.imageURLs)),
                    categories: JSON.parse(JSON.stringify(this.categories)),
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
     * @param {Array<Object>} imageURLs the image URLs to be set
     * @returns {Promise<Product>} the product object
     * @throws {ResourceNotFoundError} if the product is not found
     *
     */
    async addProduct(productInfo, variants, categories, imageURLs) {
        let builder = await this.productBuilder();
        builder = await builder.setProductInfo(productInfo);
        builder = await builder.setVariants(variants);
        builder = await builder.setCategories(categories);
        builder = await builder.setImages(imageURLs);
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
