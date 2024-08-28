import Product from "../../models/products/product.model.js";
import Variant from "../../models/products/variant.model.js";
import {
    BadRequestError,
    ConflictError,
    ResourceNotFoundError,
} from "../../utils/error.js";
import AttributeValue from "../../models/products/attributeValue.model.js";
import Attribute from "../../models/products/attribute.model.js";
import ProductImage from "../../models/products/productImage.model.js";
import VariantAttributeValue from "../../models/products/variantAttributeValue.model.js";
import AttributeVariantFilterBuilder from "../condition/filter/attributeVariantFilterBuilder.service.js";
import PaginationBuilder from "../condition/paginationBuilder.service.js";
import VariantSortBuilder from "../condition/sort/variantSortBuilder.service.js";
import variantFilterBuilder from "../condition/filter/variantFilterBuilder.service.js";
import variantAttributeService from "./variantAttribute.service.js";

class VariantService {
    /**
     * Get all variants
     *
     * @param {Object} query the query to be used to filter the variants
     * @param {Object} options the options to be used to filter the variants
     * @returns {Promise<Variant[]>} the variants
     * @throws {ResourceNotFoundError} if the variant is not found
     */
    async getVariants(query, options = { includeDeleted: false }) {
        const conditions = await this.#buildConditions(query);
        conditions.includeDeleted = {
            paranoid: !options.includeDeleted,
        };

        const { count, variantIDs } = await this.#filterVariant(conditions);

        const variants = await this.#fetchDetailedVariant(
            conditions,
            variantIDs
        );

        return {
            currentPage:
                conditions.paginationConditions.offset /
                    conditions.paginationConditions.limit +
                1,
            totalPages: Math.ceil(
                count / conditions.paginationConditions.limit
            ),
            totalItems: count,
            variants: variants,
        };
    }

    /**
     * Get a variant
     *
     * @param {String} variantID the variant ID to be retrieved
     * @param {Object} options the options to be used to filter
     * @returns {Promise<Variant>} the variant
     * @throws {ResourceNotFoundError} if the variant is not found
     */
    async getVariant(
        variantID,
        options = {
            includeDeleted: false,
        }
    ) {
        const variant = await Variant.findByPk(variantID, {
            include: [
                {
                    model: AttributeValue,
                    as: "attributeValues",
                    attributes: ["value"],
                    through: { attributes: [] },
                    include: {
                        model: Attribute,
                        as: "attribute",
                        attributes: ["name"],
                    },
                },
                {
                    model: ProductImage,
                    as: "image",
                    attributes: ["url"],
                },
            ],
            paranoid: !options.includeDeleted,
        });

        if (!variant) {
            throw new ResourceNotFoundError("Variant not found");
        }

        return variant;
    }

    /**
     * Update a variant which is identified by productID and variantID
     *
     * @param {String} variantID the variant ID to be updated
     * @param {Object} variantData the variant data to be updated
     * @returns {Promise<Variant>} the updated variant
     * @throws {ResourceNotFoundError} if the variant or image is not found
     * @throws {BadRequestError} if the discount price is greater than price
     */
    async updateVariant(variantID, variantData) {
        let variant = await Variant.findByPk(variantID);

        if (!variant) {
            throw new ResourceNotFoundError("Variant not found");
        }

        if (variantData.imageID) {
            const image = await ProductImage.findByPk(variantData.imageID);
            if (!image || image.productID !== variant.productID) {
                throw new ResourceNotFoundError("Image not found");
            }
        }

        if (variantData.discountPrice && !variantData.price) {
            if (variantData.discountPrice > variant.price) {
                throw new BadRequestError(
                    "Discount price must be less than original price"
                );
            }
        }

        await variant.update(variantData);
        variant = await variant.reload();

        // This calling service is not implemented yet
        if (variantData.attributes) {
            await VariantAttributeValue.destroy({
                where: { variantID },
            });
            variant = await variantAttributeService.addAttributesForVariant(
                variant,
                variantData.attributes
            );
        }
        return variant;
    }

    /**
     * Delete a variant with the given productID and variantID
     *
     * @param {String} variantID the variant ID to be updated
     * @throws {ResourceNotFoundError} if the product or variant is not found
     */
    async deleteVariant(variantID) {
        const variant = await Variant.findByPk(variantID);

        if (!variant) {
            throw new ResourceNotFoundError("Variant not found");
        }

        await variant.destroy();
    }

    /**
     * Get all variants of a product
     *
     * @param {String} productID the product ID to be retrieved
     * @param {Object} options the options to be used to filter
     * @returns {Promise<{Variant[], Product}>} the variants of the product
     * @throws {ResourceNotFoundError} if the product is not found
     */
    async getProductVariants(productID, options = { includeDeleted: false }) {
        const product = await Product.findByPk(productID, {
            include: [
                {
                    model: Variant,
                    as: "variants",
                    paranoid: !options.includeDeleted,
                    include: [
                        {
                            model: AttributeValue,
                            as: "attributeValues",
                            attributes: ["value"],
                            through: { attributes: [] },
                            include: {
                                model: Attribute,
                                as: "attribute",
                                attributes: ["name"],
                            },
                        },
                        {
                            model: ProductImage,
                            as: "image",
                            attributes: ["url"],
                        },
                    ],
                },
            ],
            paranoid: !options.includeDeleted,
        });

        if (!product) {
            throw new ResourceNotFoundError("Product not found");
        }

        return product.variants;
    }

    /**
     * Get a variant of a product
     *
     * @param {String} productID the product ID to be retrieved
     * @param {String} variantID the variant ID to be retrieved
     * @param {Object} options the options to be used to filter
     * @returns {Promise<Variant>} the variant of the product
     * @throws {ResourceNotFoundError} if the product or variant is not found
     */
    async getProductVariant(
        productID,
        variantID,
        options = {
            includeDeleted: false,
        }
    ) {
        const product = await Product.findByPk(productID, {
            include: [
                {
                    model: Variant,
                    as: "variants",
                    required: false,
                    paranoid: !options.includeDeleted,
                    where: {
                        variantID: variantID,
                    },
                    include: [
                        {
                            model: AttributeValue,
                            as: "attributeValues",
                            attributes: ["value"],
                            through: { attributes: [] },
                            include: {
                                model: Attribute,
                                as: "attribute",
                                attributes: ["name"],
                            },
                        },
                        {
                            model: ProductImage,
                            as: "image",
                            attributes: ["url"],
                        },
                    ],
                },
            ],
            paranoid: !options.includeDeleted,
        });

        if (!product) {
            throw new ResourceNotFoundError("Product not found");
        }

        if (!product.variants || product.variants.length === 0) {
            throw new ResourceNotFoundError("Variant not found");
        }

        return product.variants[0];
    }

    /**
     * Check if SKU exists
     *
     * @param {String} sku the SKU to be checked
     * @returns {Promise<Boolean>} true if SKU exists, false otherwise
     */
    async checkSKUExists(sku) {
        const variant = await Variant.findOne({
            where: {
                sku: sku,
            },
            attributes: ["sku"],
        });

        return variant ? true : false;
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

        const isSKUtaken = await this.checkSKUExists(restData.sku);
        if (isSKUtaken) {
            throw new ConflictError("SKU is already taken");
        }

        let variant = await Variant.create({
            ...restData,
            productID: product.productID,
        });

        if (attributes) {
            variant = await variantAttributeService.addAttributesForVariant(
                variant,
                attributes
            );
        }

        return variant;
    }

    /**
     * The following methods are private and used internally to get the variants
     */

    /**
     * Build conditions for filtering variants (used by getVariants)
     *
     * @param {Object} query the query to be used to filter the variants
     * @returns {Array} the conditions for filtering variants
     */
    async #buildConditions(query) {
        const sortConditions = new VariantSortBuilder(query).build();
        const paginationConditions = new PaginationBuilder(query).build();

        // Filter
        const variantFilter = new variantFilterBuilder(query).build();

        let attributeFilter = (
            await AttributeVariantFilterBuilder.create(query.attributes)
        ).build();

        return {
            sortConditions,
            paginationConditions,
            variantFilter,
            attributeFilter,
        };
    }

    /**
     * Filter the variants based on the conditions (used by getVariants)
     *
     * @param {Object} conditions the conditions to be used to filter the variants
     * @returns {Promise<{count: Number, variantIDs: String[]}>} the total items and variant IDs
     */
    async #filterVariant(
        conditions = {
            variantFilter: [],
            paginationConditions: {},
            attributeFilter: {},
            includeDeleted: {},
        }
    ) {
        let { count, rows } = await Variant.findAndCountAll({
            attributes: ["variantID"],
            include: [
                {
                    model: AttributeValue,
                    as: "attributeValues",
                    attributes: [],
                    through: {
                        model: VariantAttributeValue,
                        attributes: [],
                    },
                    include: {
                        model: Attribute,
                        as: "attribute",
                        attributes: [],
                    },
                },
            ],
            where: [
                ...conditions.variantFilter,
                ...conditions.attributeFilter.whereCondition,
            ],
            group: ["variantID"],
            having: conditions.attributeFilter.havingCondition,
            order: [...conditions.sortConditions],
            ...conditions.paginationConditions,
            ...conditions.includeDeleted,
            raw: true,
            subQuery: false,
            distinct: true,
        });
        count = count.reduce((acc, row) => acc + row.count, 0);
        const variantIDs = rows.map((row) => row.variantID);

        return { count, variantIDs };
    }

    /**
     * Fetch the detailed variants based on the conditions (used by getVariants)
     *
     * @param {Object} conditions the conditions to be used to filter the variants
     * @param {String[]} variantIDs the variant IDs to be fetched
     * @returns {Promise<Variant[]>} the detailed variants
     */
    async #fetchDetailedVariant(conditions, variantIDs) {
        const variants = await Variant.findAll({
            where: { variantID: variantIDs },
            include: [
                {
                    model: AttributeValue,
                    as: "attributeValues",
                    attributes: ["value"],
                    through: { attributes: [] },
                    include: {
                        model: Attribute,
                        as: "attribute",
                        attributes: ["name"],
                    },
                },
                {
                    model: ProductImage,
                    as: "image",
                    attributes: ["url"],
                },
            ],
            ...conditions.includeDeleted,
            order: [...conditions.sortConditions],
        });

        return variants;
    }
}

export default new VariantService();
