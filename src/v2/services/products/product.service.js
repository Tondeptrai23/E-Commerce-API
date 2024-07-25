import Product from "../../models/products/product.model.js";
import Category from "../../models/products/category.model.js";
import ProductImage from "../../models/products/productImage.model.js";
import ProductCategory from "../../models/products/productCategory.model.js";
import Variant from "../../models/products/variant.model.js";
import { ResourceNotFoundError } from "../../utils/error.js";
import AttributeValue from "../../models/products/attributeValue.model.js";
import Attribute from "../../models/products/attribute.model.js";
import QueryToFilterConditionConverter from "../conditionConverter/filterConverter.service.js";
import { Op } from "sequelize";

class ProductService {
    /**
     * Get all products that match the given options
     *
     * @param {Object} query the query options to filter the products
     * @returns {Promise<Product[]>} the products that match the given options
     *
     */
    async getProducts(query) {
        const filterConverter = await QueryToFilterConditionConverter.create(
            query,
            "product"
        );

        let variantConverter = await QueryToFilterConditionConverter.create(
            query.variant,
            "variant"
        );

        let categoryConverter = await QueryToFilterConditionConverter.create(
            query.category,
            "category"
        );

        let attributeConverter = await QueryToFilterConditionConverter.create(
            query.variant,
            "variantAttribute"
        );

        const variants = await Variant.findAll({
            attributes: ["variantID"],
            include: [
                {
                    model: AttributeValue,
                    as: "attributeValues",
                    attributes: [],
                    include: {
                        model: Attribute,
                        as: "attribute",
                        attributes: [],
                    },
                },
            ],
            where: variantConverter.convert(),
        });

        const variantIDs = variants.map((variant) => variant.variantID);

        const products = await Product.findAll({
            include: [
                {
                    model: Category,
                    through: ProductCategory,
                    as: "categories",
                    where: categoryConverter.convert(),
                },
                {
                    model: Variant,
                    as: "variants",
                    where: {
                        variantID: { [Op.in]: variantIDs },
                    },
                },
            ],
            where: [...filterConverter.convert()],
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
     * includes name, description, defaultVariantID
     * @returns {Promise<Product | null>} the updated product
     * @throws {ResourceNotFoundError} if the product is not found
     */
    async updateProduct(productID, { name, description, defaultVariantID }) {
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
