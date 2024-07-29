import Product from "../../models/products/product.model.js";
import Category from "../../models/products/category.model.js";
import ProductImage from "../../models/products/productImage.model.js";
import ProductCategory from "../../models/products/productCategory.model.js";
import Variant from "../../models/products/variant.model.js";
import VariantAttributeValue from "../../models/products/variantAttributeValue.model.js";
import AttributeValue from "../../models/products/attributeValue.model.js";
import Attribute from "../../models/products/attribute.model.js";
import { ResourceNotFoundError } from "../../utils/error.js";
import { Op } from "sequelize";
import { db } from "../../models/index.model.js";
import categoryService from "./category.service.js";
import FilterBuilder from "../condition/filterBuilder.service.js";
import AttributeFilterBuilder from "../condition/attributeFilterBuilder.service.js";
import ProductSortBuilder from "../condition/productSortBuilder.service.js";
import PaginationBuilder from "../condition/paginationBuilder.service.js";
import { flattenArray, toArray } from "../../utils/utils.js";

class ProductService {
    /**
     * Get all products that match the given options
     * Support filtering by product, variant, category, and attribute
     *
     * @param {Object} query the query options to filter the products
     * @returns {Promise<Product[]>} the products that match the given options
     *
     */
    async getProducts(query) {
        const conditions = await this.#buildConditions(query);

        // Retrieve all variants that match the attribute filter and the variant filter
        const variants = await this.#filterVariant(conditions);

        // Extract the productIDs and variantIDs of the variants
        const { productIDs, variantIDs } = this.#extractProductAndVariantIds(
            variants,
            query.oneVariant === "true"
        );

        // Find all products that satisfy the given conditions
        const { count, satisfiedIDs } = await this.#findSatisfiedProducts(
            conditions,
            variantIDs,
            productIDs
        );

        // Fetch detailed product info by the satisfied productIDs
        const products = await this.#fetchDetailedProducts(
            conditions,
            satisfiedIDs,
            variantIDs
        );

        // If the query is to get only one variant of each product
        if (query.oneVariant === "true") {
            products.forEach((product) => {
                product.dataValues.variants = [product.variants[0]];
            });
        }

        return {
            currentPage:
                conditions.paginationConditions.offset /
                    conditions.paginationConditions.limit +
                1,
            totalPages: Math.ceil(
                count / conditions.paginationConditions.limit
            ),
            totalItems: count,
            products: products,
        };
    }

    /**
     * Get a product with the given productID, return null if not found
     *
     * @param {String} productID the product ID to be retrieved
     * @returns {Promise<Product | null>} the product with the given productID
     */
    async getProduct(productID) {
        const product = await Product.findOne({
            where: {
                productID: productID,
            },
            include: [
                {
                    model: Category,
                    through: ProductCategory,
                    as: "categories",
                },
                {
                    model: ProductImage,
                    as: "images",
                },
                {
                    model: Variant,
                    as: "variants",
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

        return product;
    }

    /**
     * Update a product which is identified by productID
     * with the new product info. Return null if the product is not found
     *
     * @param {String} productID the product ID to be updated
     * @param {Object} productInfo the product info to be updated,
     * includes name, description
     * @returns {Promise<Product | null>} the updated product
     * @throws {ResourceNotFoundError} if the product is not found
     */
    async updateProduct(productID, { name, description }) {
        const product = await Product.findByPk(productID);
        if (!product) {
            throw new ResourceNotFoundError("Product not found");
        }

        product.name = name ? name : product.name;
        product.description = description ? description : product.description;

        await product.save();
        return product;
    }

    /**
     * Delete a product with the given productID
     *
     * @param {String} productID the product ID to be updated
     * @throws {ResourceNotFoundError} if the product is not found
     */
    async deleteProduct(productID) {
        const product = await Product.findByPk(productID);
        if (!product) {
            throw new ResourceNotFoundError("Product not found");
        }
        await product.destroy();
    }

    /**
     * The following methods are private and used internally by the ProductService
     */

    /**
     * Build the conditions for querying the products
     * including sorting, filtering, and pagination
     * Used internally by the getProducts method
     *
     * @param {Object} query the query options to filter the products
     */
    async #buildConditions(query) {
        const sortConditions = new ProductSortBuilder(query).build();
        const paginationConditions = new PaginationBuilder(query).build();
        // Filter building by query
        const productFilter = new FilterBuilder(query, "product").build();
        const variantFilter = new FilterBuilder(
            query.variant,
            "variant"
        ).build();

        // Retrieve all descendant categories of the given categories
        const categoryFilter = flattenArray(
            await Promise.all(
                toArray(query.category).map(async (category) => {
                    return await categoryService.getDescendantCategoriesByName(
                        category
                    );
                })
            )
        );

        let attributeFilter = (
            await AttributeFilterBuilder.create(query.attribute)
        ).build();

        return {
            sortConditions,
            paginationConditions,
            productFilter,
            variantFilter,
            categoryFilter,
            attributeFilter,
        };
    }

    /**
     * Filter the variants that match the given variant filter and attribute filter
     *
     * @param {Object[]} conditions.variantFilter the filter options to filter the variants
     * @param {Object[]} conditions.attributeFilter the filter options to filter the attributes
     * @returns {Promise<Variant[]>} the variants that match the given options
     */
    async #filterVariant(
        conditions = { variantFilter: [], attributeFilter: [] }
    ) {
        const variants = await Variant.findAll({
            attributes: ["variantID", "productID"],
            joinTableAttributes: [],
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

                // Filter by attribute values
                ...(conditions.attributeFilter.length !== 0
                    ? [
                          {
                              [Op.or]: [
                                  ...conditions.attributeFilter.map(
                                      (attribute) => {
                                          return {
                                              "$attributeValues.attribute.name$":
                                                  attribute.name,
                                              "$attributeValues.value$":
                                                  attribute.value,
                                          };
                                      }
                                  ),
                              ],
                          },
                      ]
                    : []),
            ],
            group: ["variantID", "productID"],
            having: db.literal(
                "COUNT(DISTINCT `attributeValues`.`valueID`) >= " +
                    conditions.attributeFilter.length
            ),

            raw: true,
        });

        return variants;
    }

    /**
     * Extracts unique product IDs from a list of variants.
     * If oneVariant is true, only one variant of each product is returned.
     *
     * @param {Array} variants - An array of variant objects.
     * @param {Boolean} oneVariant - If true, only unique product IDs are returned.
     * @returns {Object} An object containing unique product IDs and variant IDs.
     */
    #extractProductAndVariantIds(variants, oneVariant = false) {
        let extractedData = {};
        extractedData = variants.reduce(
            (acc, variant) => {
                if (
                    !acc.productIDs.has(variant.productID) ||
                    oneVariant === false
                ) {
                    acc.variantIDs.push(variant.variantID);
                    acc.productIDs.add(variant.productID);
                }
                return acc;
            },
            { variantIDs: [], productIDs: new Set() }
        );

        extractedData.productIDs = [...extractedData.productIDs];
        return extractedData;
    }

    /**
     * Find all products that satisfy the given conditions
     *
     * @param {Object} conditions the conditions to filter the products
     * @param {Array} variantIDs the variant IDs to filter the products
     * @param {Array} productIDs the product IDs to filter the products
     * @returns {Object} the count of the satisfied products and their IDs
     */
    async #findSatisfiedProducts(
        conditions = {
            categoryFilter: [],
            productFilter: [],
            paginationConditions: {},
        },
        variantIDs = [],
        productIDs = []
    ) {
        const { count, rows } = await Product.findAndCountAll({
            attributes: [
                [db.literal("DISTINCT `product`.`productID`"), "productID"],
            ],

            include: [
                {
                    model: Category,
                    through: { model: ProductCategory, attributes: [] },
                    as: "categories",
                    attributes: [],
                    where: {
                        name:
                            conditions.categoryFilter.length !== 0
                                ? { [Op.in]: conditions.categoryFilter }
                                : { [Op.ne]: null },
                    },
                },

                {
                    model: Variant,
                    as: "variants",
                    where: {
                        variantID: { [Op.in]: variantIDs },
                    },
                    attributes: [],
                },
            ],
            where: [
                { productID: { [Op.in]: productIDs } },
                ...conditions.productFilter,
            ],

            ...conditions.paginationConditions,
            subQuery: false,
            raw: true,
            distinct: true,
        });
        const satisfiedIDs = rows.map((row) => row.productID);
        return { count, satisfiedIDs };
    }

    /**
     * Fetch detailed product info by the satisfied productIDs
     *
     * @param {Object} conditions.sortConditions the sort conditions to sort the products
     * @param {Array} satisfiedIDs the satisfied product IDs
     * @param {Array} variantIDs the variant IDs to filter the products
     * @returns {Promise<Product[]>} the products that match the given options
     */
    async #fetchDetailedProducts(
        conditions = { sortConditions: [] },
        satisfiedIDs = [],
        variantIDs = []
    ) {
        // Getting detailed product info by the satisfied productIDs
        const products = await Product.findAll({
            include: [
                {
                    model: Category,
                    as: "categories",
                },
                {
                    model: Variant,
                    as: "variants",
                    include: {
                        model: ProductImage,
                        as: "image",
                        required: false,
                    },
                    where: {
                        variantID: { [Op.in]: variantIDs },
                    },
                },
            ],

            where: {
                productID: {
                    [Op.in]: satisfiedIDs,
                },
            },
            order: [...conditions.sortConditions],
        });

        return products;
    }
}

export default new ProductService();
