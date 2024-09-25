import Product from "../../models/products/product.model.js";
import Category from "../../models/products/category.model.js";
import ProductImage from "../../models/products/productImage.model.js";
import ProductCategory from "../../models/products/productCategory.model.js";
import Variant from "../../models/products/variant.model.js";
import VariantAttributeValue from "../../models/products/variantAttributeValue.model.js";
import AttributeValue from "../../models/products/attributeValue.model.js";
import Attribute from "../../models/products/attribute.model.js";
import { ResourceNotFoundError } from "../../utils/error.js";
import { Model, Op } from "sequelize";
import { db } from "../../models/index.model.js";
import categoryService from "./category.service.js";
import ProductFilterBuilder from "../condition/filter/productFilterBuilder.service.js";
import VariantFilterBuilder from "../condition/filter/variantFilterBuilder.service.js";
import AttributeVariantFilterBuilder from "../condition/filter/attributeVariantFilterBuilder.service.js";
import ProductSortBuilder from "../condition/sort/productSortBuilder.service.js";
import PaginationBuilder from "../condition/paginationBuilder.service.js";
import { flattenArray, toArray } from "../../utils/utils.js";

class ProductService {
    /**
     * Get all products that match the given options
     * Support filtering by product, variant, category, and attribute
     *
     * @param {Object} query the query options to filter the products
     * @param {Object} options the options to include deleted products
     * @returns {Promise<Product[]>} the products that match the given options
     *
     */
    async getProducts(query, options = { includeDeleted: false }) {
        const conditions = await this.#buildConditions(query);
        conditions.includeDeleted = options.includeDeleted;

        const satifiedIDs = await this.#filterProducts(conditions);

        if (satifiedIDs.length === 0) {
            return {
                currentPage: 1,
                totalPages: 1,
                totalItems: 0,
                products: [],
            };
        }

        const CTE = this.#getCTEtoFilterVariant(conditions, satifiedIDs);

        const { count, productIDs, variantIDs } =
            await this.#getSatisfiedProducts(conditions, CTE);

        const result = await this.#fetchFilteredProducts(
            conditions,
            productIDs,
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
            products: result,
        };
    }

    /**
     * Get a product with the given productID, return null if not found
     *
     * @param {String} productID the product ID to be retrieved
     * @returns {Promise<Product | null>} the product with the given productID
     */
    async getProduct(
        productID,
        options = {
            includeDeleted: false,
        }
    ) {
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
                    paranoid: !options.includeDeleted,
                    include: [
                        {
                            model: AttributeValue,
                            as: "attributeValues",
                            attributes: ["value"],
                            through: {
                                attributes: [],
                            },
                            include: {
                                model: Attribute,
                                as: "attribute",
                                attributes: ["name"],
                            },
                        },
                        {
                            model: ProductImage,
                            as: "image",
                        },
                    ],
                },
            ],
            paranoid: !options.includeDeleted,
        });

        return product;
    }

    /**
     * Check if product name is already taken
     *
     * @param {String} name the product name to be checked
     * @returns {Promise<Boolean>} true if the product name is already taken, false otherwise
     */
    async isProductNameTaken(name) {
        if (!name) {
            return false;
        }

        const product = await Product.findOne({
            where: {
                name: name,
            },
            paranoid: false,
        });

        return product !== null;
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
     *
     *
     * The following methods are private and used internally to get products
     *
     *
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
        sortConditions.push("`variant`.`variantID` ASC"); // Default sorting by variantID

        const paginationConditions = new PaginationBuilder(query).build();
        // Filter building by query
        const productFilter = new ProductFilterBuilder(query).build();
        const variantFilter = new VariantFilterBuilder(query.variant).build();

        // Retrieve all descendant categories of the given categories
        const categoryFilter = flattenArray(
            await Promise.all(
                toArray(query.category).map(async (category) => {
                    try {
                        const categoryNames = (
                            await categoryService.getDescendantCategories(
                                category
                            )
                        ).map((category) => category.name);

                        return categoryNames;
                    } catch (err) {
                        // If the category does not exist, return an empty array
                        return [];
                    }
                })
            )
        );

        let attributeFilter = (
            await AttributeVariantFilterBuilder.create(query.attributes)
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
     * Filter products based on their fields and categories
     *
     * @param {Object} conditions the conditions to filter the products
     * @returns {Promise<String[]>} the product IDs that match the given conditions
     */
    async #filterProducts(conditions) {
        const productIDs = await Product.findAll({
            attributes: ["productID"],
            include: {
                model: Category,
                through: { model: ProductCategory, attributes: [] },
                as: "categories",
                attributes: [],
                where:
                    conditions.categoryFilter.length !== 0
                        ? {
                              name: conditions.categoryFilter,
                          }
                        : undefined,
            },
            where: conditions.productFilter,
            paranoid: !conditions.includeDeleted,
        });

        return productIDs.map((product) => product.productID);
    }

    /**
     * Get the CTE to filter the variants
     * Used internally by the getProducts method
     *
     * Use queryInterface to generate the raw SQL query from the sequelize options
     * Because sequelize does not support CTE
     *
     * @param {Object} conditions the conditions to filter the variants
     * @param {Array} productIDs the product IDs to filter the variants
     * @returns {String} the CTE to filter the variants
     */
    #getCTEtoFilterVariant(
        conditions = {
            variantFilter: [],
            attributeFilter: [],
            includeDeleted: {},
            sortConditions: [],
        },
        productIDs = []
    ) {
        const options = {
            attributes: [
                "variantID",
                "productID",
                [
                    db.literal(
                        `ROW_NUMBER() OVER 
                        (ORDER BY ${conditions.sortConditions.join(", ")})`
                    ),
                    "rowNumber",
                ],
                [
                    db.literal(
                        `ROW_NUMBER() OVER 
                        (PARTITION BY \`variant\`.\`productID\` 
                        ORDER BY ${conditions.sortConditions.join(", ")})`
                    ),
                    "partitionCount",
                ],
            ],
            include: [
                {
                    model: Product,
                    as: "product",
                    attributes: [],
                },
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
                {
                    productID: {
                        [Op.in]: productIDs,
                    },
                },
                conditions.includeDeleted
                    ? {}
                    : {
                          "$product.deletedAt$": null,
                          "$variant.deletedAt$": null,
                      },
            ],
            group: ["variantID", "productID"],
            having: conditions.attributeFilter.havingCondition,

            raw: true,
        };

        // Get the CTE
        Model._validateIncludedElements.bind(Variant)(options);
        const cte = db
            .getQueryInterface()
            .queryGenerator.selectQuery("variants", options, Variant)
            .slice(0, -1);

        return cte;
    }

    /**
     * Get the products that satisfy the given conditions
     * Used internally by the getProducts method
     *
     * @param {Object} conditions the conditions to filter the products
     * @param {String} CTE the CTE to filter
     * @returns {Promise<count: Number, productIDs: String[], variantIDs: String[]>} the products that match the given IDs
     */
    async #getSatisfiedProducts(conditions, CTE) {
        const count = (
            await db.query(
                `WITH CTE AS (${CTE})
                SELECT COUNT(DISTINCT p.productID) AS count 
                FROM products p JOIN CTE ON CTE.productID = p.productID`.trim(),
                {
                    type: db.QueryTypes.SELECT,
                    plain: true,
                }
            )
        ).count;

        const result = await db.query(
            `WITH CTE AS (${CTE})
            SELECT v.productID, v.variantID
            FROM variants v
            JOIN CTE ON CTE.variantID = v.variantID AND CTE.partitionCount = 1
            ORDER BY CTE.rowNumber
            LIMIT ${conditions.paginationConditions.limit}
            OFFSET ${conditions.paginationConditions.offset}`.trim(),
            {
                type: db.QueryTypes.SELECT,
                nest: true,
            }
        );

        // Extract productIDs and variantIDs from the result
        const { productIDs, variantIDs } = result.reduce(
            (acc, { productID, variantID }) => {
                acc.productIDs.push(productID);
                acc.variantIDs.push(variantID);
                return acc;
            },
            { productIDs: [], variantIDs: [] }
        );

        return { count, productIDs, variantIDs };
    }

    /**
     * Fetch details of the filtered products
     *
     * @param {Object} conditions the conditions to filter the products
     * @param {String[]} productIDs the product IDs to be fetched
     * @param {String[]} variantIDs the variant IDs to be fetched
     * @returns {Promise<Product[]>} the products that match the given IDs
     */
    async #fetchFilteredProducts(conditions, productIDs, variantIDs) {
        let products = await Product.findAll({
            where: {
                productID: productIDs,
            },
            include: [
                {
                    model: Category,
                    through: ProductCategory,
                    as: "categories",
                },
                {
                    model: Variant,
                    as: "variants",
                    where: {
                        variantID: variantIDs,
                    },
                    include: {
                        model: ProductImage,
                        as: "image",
                    },
                    paranoid: !conditions.includeDeleted,
                },
            ],
            paranoid: !conditions.includeDeleted,
        });

        // Sort products based on productIDs
        const sortedProducts = productIDs.map((productID) =>
            products.find((product) => product.productID === productID)
        );

        return sortedProducts;
    }
}

export default new ProductService();
