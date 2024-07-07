import { Product } from "../../models/products/product.model.js";
import { Category } from "../../models/products/category.model.js";
import { ProductImage } from "../../models/products/productImage.model.js";
import { ProductCategory } from "../../models/products/productCategory.model.js";
import { Variant } from "../../models/products/variant.model.js";
import { ResourceNotFoundError } from "../../utils/error.js";

const includeOption = {
    nonAssociated: [
        {
            model: Variant,
            as: "defaultVariant",
        },
    ],
    associated: [
        {
            model: Category,
            through: ProductCategory,
            as: "categories",
        },
        {
            model: ProductImage,
            as: "productImages",
        },
        {
            model: Variant,
            as: "variants",
        },
        {
            model: Variant,
            as: "defaultVariant",
        },
    ],
};

class ProductService {
    /**
     * Get all products that match the given options
     *
     * @param {Object} options the options for the query
     * @param {Boolean} options.includeAssociated whether to include associated data or not
     * @returns {Promise<Product[]>} the products that match the given options
     *
     */
    async getProducts({ includeAssociated = false }) {
        const products = await Product.findAll({
            include: includeAssociated
                ? includeOption.associated
                : includeOption.nonAssociated,
        });

        return products;
    }

    /**
     * Get a product with the given productID, return null if not found
     *
     * @param {String} productID the product ID to be retrieved
     * @param {Object} options the options for the query
     * @param {Boolean} options.includeAssociated whether to include associated data or not
     * @returns {Promise<Product | null>} the product with the given productID
     */
    async getProduct(productID, { includeAssociated = false }) {
        const product = await Product.findOne({
            where: {
                productID: productID,
            },
            include: includeAssociated
                ? includeOption.associated
                : includeOption.nonAssociated,
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
        product.defaultVariantID = defaultVariantID
            ? defaultVariantID
            : product.defaultVariantID;

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
