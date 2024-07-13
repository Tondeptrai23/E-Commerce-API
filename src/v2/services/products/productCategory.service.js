import { ResourceNotFoundError } from "../../utils/error.js";
import Product from "../../models/products/product.model.js";
import Category from "../../models/products/category.model.js";
import ProductCategory from "../../models/products/productCategory.model.js";
import productBuilderService from "./productBuilder.service.js";

class ProductCategoryService {
    /**
     * Update the categories of a product (replace all categories with the new ones)
     *
     * @param {String} productID the product ID to be updated
     * @param {Array<String>} categories the array of category names to be set
     * @returns {Promise<Product>} the updated product
     * @throws {ResourceNotFoundError} if the product is not found
     */
    async updateCategory(productID, categories) {
        await ProductCategory.destroy({
            where: {
                productID: productID,
            },
        });
        return await productBuilderService.addCategories(productID, categories);
    }

    /**
     * Delete a category with the given productID and categoryName
     *
     * @param {String} productID the product ID to be updated
     * @param {String} categoryName the category's name to be updated
     * @throws {ResourceNotFoundError} if the product or category is not found
     */
    async deleteCategory(productID, categoryName) {
        const product = await Product.findByPk(productID, {
            include: {
                model: Category,
                through: ProductCategory,
                as: "categories",
                where: {
                    name: categoryName,
                },
            },
        });

        if (!product) {
            throw new ResourceNotFoundError("Product or Category not found");
        }

        await product.removeCategory(product.categories[0]);
    }

    /**
     * Get all categories of a product
     *
     * @param {String} productID the product ID to be retrieved
     * @returns {Promise<Category[]>} the categories of the product
     * @throws {ResourceNotFoundError} if the product is not found
     */
    async getProductCategories(productID) {
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
            ],
        });

        if (!product) {
            throw new ResourceNotFoundError("Product not found");
        }

        const categories = product.categories;
        return categories;
    }
}

export default new ProductCategoryService();
