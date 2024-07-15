import Category from "../../models/products/category.model.js";

class CategoryService {
    /**
     * Get all descendant categories of a category
     *
     * @param {String} categoryID the category ID to get all categories from
     * @returns {Promise<Product[]>} the categories that match the given options
     */
    async getDescendantCategories(categoryID) {
        const childCategories = await Category.findAll({
            where: {
                parentID: categoryID,
            },
        });

        if (childCategories.length === 0) {
            return [];
        }

        return childCategories
            .concat(
                await Promise.all(
                    childCategories.map(
                        async (category) =>
                            await this.getDescendantCategories(
                                category.categoryID
                            )
                    )
                )
            )
            .flat();
    }

    /**
     * Get all ascendant categories of a category
     *
     * @param {String} categoryID the category ID to get all categories from
     * @returns {Promise<Category[]>} the categories that match the given options
     */
    async getAscendantCategories(categoryID) {
        const categories = await Category.findAll({
            where: {
                categoryID: categoryID,
            },
        });

        if (!categories) {
            return [];
        }

        if (categories[0].parentID) {
            return categories.concat(
                await this.getAscendantCategories(categories[0].parentID)
            );
        }

        return categories;
    }
}

export default new CategoryService();
