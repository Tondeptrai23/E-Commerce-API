import Product from "../../models/products/product.model.js";
import Variant from "../../models/products/variant.model.js";
import attributeService from "./attribute.service.js";
import { ResourceNotFoundError } from "../../utils/error.js";
import AttributeValue from "../../models/products/attributeValue.model.js";
import Attribute from "../../models/products/attribute.model.js";

class VariantService {
    /**
     * Get a variant of a product
     *
     * @param {String} productID the product ID to be retrieved
     * @param {String} variantID the variant ID to be retrieved
     * @returns {Promise<Variant>} the variant of the product
     * @throws {ResourceNotFoundError} if the product or variant is not found
     */
    async getVariant(productID, variantID) {
        const product = await Product.findByPk(productID, {
            include: [
                {
                    model: Variant,
                    as: "variants",
                    where: {
                        variantID: variantID,
                    },
                    include: {
                        model: AttributeValue,
                        as: "attributeValues",

                        include: {
                            model: Attribute,
                            as: "attribute",
                        },
                    },
                },
            ],
        });

        if (!product) {
            throw new ResourceNotFoundError("Product or Variant not found");
        }

        return product.variants[0];
    }

    /**
     * Update a variant which is identified by productID and variantID
     *
     * @param {String} productID the product ID to be updated
     * @param {String} variantID the variant ID to be updated
     * @param {Object} variantData the variant data to be updated
     * @returns {Promise<Variant>} the updated variant
     * @throws {ResourceNotFoundError} if the product or variant is not found
     */
    async updateVariant(productID, variantID, variantData) {
        let variant = await this.getVariant(productID, variantID);
        await variant.update(variantData);
        variant = await variant.reload();

        return variant;
    }

    /**
     * Delete a variant with the given productID and variantID
     *
     * @param {String} productID the product ID to be updated
     * @param {String} variantID the variant ID to be updated
     * @throws {ResourceNotFoundError} if the product or variant is not found
     */
    async deleteVariant(productID, variantID) {
        const variant = await this.getVariant(productID, variantID);
        await variant.destroy();
    }

    /**
     * Get all variants of a product
     *
     * @param {String} productID the product ID to be retrieved
     * @returns {Promise<Variant[]>} the variants of the product
     * @throws {ResourceNotFoundError} if the product is not found
     */
    async getProductVariants(productID) {
        const product = await Product.findByPk(productID, {
            include: [
                {
                    model: Variant,
                    as: "variants",
                },
            ],
        });
        if (!product) {
            throw new ResourceNotFoundError("Product not found");
        }

        const variants = product.variants;
        return variants;
    }

    /**
     * Create a variant for a product with the given variant data
     *
     * @param {Product} product the product to be added a variant
     * @param {Object} variantData the variant data to be added
     * @returns {Promise<Variant>} the added variant in JSON format
     */
    async createVariantForProduct(product, variantData) {
        const { attributes, ...restData } = variantData;

        const variant = await product.createVariant(restData);

        if (attributes) {
            await attributeService.addAttributesForVariant(variant, attributes);
        }

        return variant;
    }
}

export default new VariantService();
