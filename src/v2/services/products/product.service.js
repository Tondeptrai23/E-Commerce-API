import Product from "../../models/products/product.model.js";
import Category from "../../models/products/category.model.js";
import ProductImage from "../../models/products/productImage.model.js";
import ProductCategory from "../../models/products/productCategory.model.js";
import Variant from "../../models/products/variant.model.js";
import VariantAttributeValue from "../../models/products/variantAttributeValue.model.js";
import AttributeValue from "../../models/products/attributeValue.model.js";
import Attribute from "../../models/products/attribute.model.js";
import { ResourceNotFoundError } from "../../utils/error.js";
import { HasMany, literal, Op } from "sequelize";
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
        const {
            sortConditions,
            paginationConditions,
            productFilter,
            variantFilter,
            categoryFilter,
            attributeFilter,
        } = await this.#buildConditions(query);

        // Retrieve all variants that match the attribute filter and the variant filter
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
                ...variantFilter,

                // Filter by attribute values
                ...(attributeFilter.length !== 0
                    ? [
                          {
                              [Op.or]: [
                                  ...attributeFilter.map((attribute) => {
                                      return {
                                          "$attributeValues.attribute.name$":
                                              attribute.name,
                                          "$attributeValues.value$":
                                              attribute.value,
                                      };
                                  }),
                              ],
                          },
                      ]
                    : []),
            ],
            group: ["variantID", "productID"],
            having: db.literal(
                "COUNT(DISTINCT `attributeValues`.`valueID`) >= " +
                    attributeFilter.length
            ),

            raw: true,
        });

        // Retrieve the productIDs and variantIDs of the variants
        // If the query is to get only one variant of each product
        // Then only get the first variant of each product
        let destructuredVariants = {};
        if (query.oneVariant === "true") {
            destructuredVariants = variants.reduce(
                (acc, variant) => {
                    if (!acc.productIDs.has(variant.productID)) {
                        acc.variantIDs.push(variant.variantID);
                        acc.productIDs.add(variant.productID);
                    }
                    return acc;
                },
                { variantIDs: [], productIDs: new Set() }
            );
        } else {
            destructuredVariants = variants.reduce(
                (acc, variant) => {
                    acc.variantIDs.push(variant.variantID);
                    acc.productIDs.add(variant.productID);
                    return acc;
                },
                { variantIDs: [], productIDs: new Set() }
            );
        }
        destructuredVariants.productIDs = [...destructuredVariants.productIDs];
        const { variantIDs, productIDs } = destructuredVariants;

        // Retrieve all products that match the product filter, category filter
        // And have at least one variant that matches the variant filter
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
                            categoryFilter.length !== 0
                                ? { [Op.in]: categoryFilter }
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
            where: [{ productID: { [Op.in]: productIDs } }, ...productFilter],

            ...paginationConditions,
            subQuery: false,
            raw: true,
            distinct: true,
        });
        const satisfiedIDs = rows.map((row) => row.productID);

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
            order: [...sortConditions],
        });

        // If the query is to get only one variant of each product
        if (query.oneVariant === "true") {
            products.forEach((product) => {
                product.dataValues.variants = [product.variants[0]];
            });
        }

        return {
            currentPage:
                paginationConditions.offset / paginationConditions.limit + 1,
            totalPages: Math.ceil(count / paginationConditions.limit),
            totalItems: count,
            items: products,
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
}

export default new ProductService();
