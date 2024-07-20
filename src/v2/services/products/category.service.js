import Category from "../../models/products/category.model.js";

class CategoryService {
    /**
     * Get all categories' names
     *
     * @returns {Promise<String>} the categories' names
     */
    async getCategoryNames() {
        return (
            await Category.findAll({
                attributes: ["name"],
            })
        ).map((category) => category.name);
    }

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
        const category = await Category.findOne({
            where: {
                categoryID: categoryID,
            },
        });

        if (!category) {
            return [];
        }

        if (category.parentID) {
            return [
                category,
                ...(await this.getAscendantCategories(category.parentID)),
            ];
        }

        return [category];
    }
}

export default new CategoryService();
