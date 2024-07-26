import Product from "../../models/products/product.model.js";
import Category from "../../models/products/category.model.js";
import ProductImage from "../../models/products/productImage.model.js";
import ProductCategory from "../../models/products/productCategory.model.js";
import Variant from "../../models/products/variant.model.js";
import { ResourceNotFoundError } from "../../utils/error.js";
import VariantAttributeValue from "../../models/products/variantAttributeValue.model.js";
import AttributeValue from "../../models/products/attributeValue.model.js";
import Attribute from "../../models/products/attribute.model.js";
import FilterBuilder from "../condition/filterBuilder.service.js";
import { Op } from "sequelize";
import { db } from "../../models/index.model.js";
import AttributeFilterBuilder from "../condition/attributeFilterBuilder.service.js";
import categoryService from "./category.service.js";
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

        // Retrieve all variants that match the attribute filter and the variant filter
        const variants = await Variant.findAll({
            attributes: ["variantID"],
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
            group: ["variantID"],
            having: db.literal(
                "COUNT(DISTINCT `attributeValues`.`valueID`) >= " +
                    attributeFilter.length
            ),
        });

        const variantIDs = variants.map((variant) => variant.variantID);

        // Retrieve all products that match the product filter, category filter
        // And have at least one variant that matches the variant filter
        const products = await Product.findAll({
            include: [
                {
                    model: Category,
                    through: ProductCategory,
                    as: "categories",
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
                },
            ],
            where: [...productFilter],
        });
        return products;
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
}

export default new ProductService();
