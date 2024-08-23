import Category from "../../models/products/category.model.js";
import { ResourceNotFoundError } from "../../utils/error.js";
import { Op } from "sequelize";
import PaginationBuilder from "../condition/paginationBuilder.service.js";
import CategoryFilterBuilder from "../condition/filter/categoryFilterBuilder.service.js";
import CategorySortBuilder from "../condition/sort/categorySortBuilder.service.js";
import FilterBuilder from "../condition/filter/filterBuilder.service.js";

class CategoryService {
    /**
     * Get all categories
     *
     * @param {Object} query the query object
     * @returns {Promise<Category[]>} the categories that match the given options
     */
    async getCategories(query) {
        const paginationConditions = new PaginationBuilder(query).build();
        const sortConditions = new CategorySortBuilder(query).build();
        const categoryFilter = new CategoryFilterBuilder(query).build();
        const parentFilter = new FilterBuilder({
            name: query.parentName,
        }).build();

        const parents = (
            await Category.findAll({
                attributes: ["categoryID"],
                where: [...parentFilter],
            })
        ).map((category) => category.categoryID);

        const { count, rows: categories } = await Category.findAndCountAll({
            where: [...categoryFilter],
            include: {
                model: Category,
                as: "parent",
                where:
                    parents.length > 0
                        ? {
                              categoryID: parents,
                          }
                        : {},
            },
            order: sortConditions,
            ...paginationConditions,
        });

        return {
            currentPage:
                paginationConditions.offset / paginationConditions.limit + 1,
            totalPages: Math.ceil(count / paginationConditions.limit),
            totalItems: count,
            categories: categories,
        };
    }

    /**
     * Get all categories for user
     *
     * @param {Object} query the query object
     * @returns {Promise<Category[]>} the categories that match the given options
     */
    async getCategoriesForUser(query) {
        const paginationConditions = new PaginationBuilder(query).build();

        return await Category.findAll({
            ...paginationConditions,
        });
    }

    /**
     * Get a category by name
     *
     * @param {String} name the category name to get
     * @returns {Promise<Category>} the category that matches the given options
     * @throws {ResourceNotFoundError} if the category does not exist
     */
    async getCategory(name) {
        const category = await Category.findOne({
            where: {
                name: name,
            },
            include: {
                model: Category,
                as: "parent",
            },
        });

        if (!category) {
            throw new ResourceNotFoundError("Category not found");
        }

        return category;
    }

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
    async getDescendantCategoriesByID(categoryID) {
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
                            await this.getDescendantCategoriesByID(
                                category.categoryID
                            )
                    )
                )
            )
            .flat();
    }

    /**
     * Get all descendant categories of a category by category info ()
     *
     * @param {String} categoryInfo the category info to get all categories from
     * @returns {Promise<Category[]>} the categories that match the given options
     * @throws {ResourceNotFoundError} if the category does not exist
     */
    async getDescendantCategories(categoryInfo) {
        const category = await Category.findOne({
            where: {
                [Op.or]: { categoryID: categoryInfo, name: categoryInfo },
            },
        });

        if (!category) {
            throw new ResourceNotFoundError("Category not found");
        }

        return [
            category,
            ...(await this.getDescendantCategoriesByID(category.categoryID)),
        ];
    }

    /**
     * Get all ascendant categories of a category
     *
     * @param {String} categoryInfo the category ID or category name to get all categories from
     * @returns {Promise<Category[]>} the categories that match the given options
     */
    async getAscendantCategories(categoryInfo) {
        const category = await Category.findOne({
            where: {
                [Op.or]: { categoryID: categoryInfo, name: categoryInfo },
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

    /**
     * Check if category name is taken
     *
     * @param {String} name the category name to check
     * @returns {Promise<Boolean>} true if the category exists, false otherwise
     */
    async isCategoryNameTaken(name) {
        const category = await Category.findOne({
            where: {
                name: name,
            },
        });

        return category ? true : false;
    }

    /**
     * Create a category
     *
     * @param {Object} category the category object
     * @returns {Promise<Category>} the created category
     * @throws {ResourceNotFoundError} if the parent category does not exist
     */
    async createCategory(categoryData) {
        if (categoryData.parent) {
            const parent = await Category.findOne({
                where: {
                    [Op.or]: {
                        name: categoryData.parent,
                        categoryID: categoryData.parent,
                    },
                },
            });

            if (!parent) {
                throw new ResourceNotFoundError(
                    "Parent category does not exist"
                );
            }
            categoryData.parentID = parent.categoryID;
        }
        return await Category.create(categoryData);
    }

    /**
     * Update a category
     *
     * @param {String} name the category name to update
     * @param {Object} category the category object
     * @returns {Promise<Category>} the updated category
     * @throws {ResourceNotFoundError} if the category or parent category does not exist
     */
    async updateCategory(name, categoryData) {
        if (categoryData.parent) {
            const parent = await Category.findOne({
                where: {
                    [Op.or]: {
                        name: categoryData.parent,
                        categoryID: categoryData.parent,
                    },
                },
            });

            if (!parent) {
                throw new ResourceNotFoundError("Parent category not found");
            }

            categoryData.parentID = parent.categoryID;
        } else {
            categoryData.parentID = null;
        }

        const category = await Category.findOne({
            where: {
                name: name,
            },
        });

        if (!category) {
            throw new ResourceNotFoundError("Category not found");
        }

        return await category.update(categoryData);
    }

    /**
     * Delete a category
     *
     * @param {String} name the category name to delete
     * @throws {ResourceNotFoundError} if the category does not exist
     */
    async deleteCategory(name) {
        const category = await Category.findOne({
            where: {
                name: name,
            },
        });

        if (!category) {
            throw new ResourceNotFoundError("Category not found");
        }

        await category.destroy();
    }
}

export default new CategoryService();
