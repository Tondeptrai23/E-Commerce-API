import categoryService from "../../../../services/products/category.service.js";
import seedData from "../../../../seedData.js";
import Category from "../../../../models/products/category.model.js";
import { ResourceNotFoundError } from "../../../../utils/error.js";

beforeAll(async () => {
    await seedData();
}, 15000);

describe("CategoryService", () => {
    describe("CategoryService.getCategories", () => {
        test("should return an array of categories", async () => {
            const categories = await categoryService.getCategories({});
            expect(categories).toBeInstanceOf(Array);
            expect(categories[0]).toBeInstanceOf(Category);
        });
    });

    describe("CategoryService.getCategory", () => {
        test("should return a category if the category exists", async () => {
            const category = await categoryService.getCategory("blouse");
            expect(category).toBeInstanceOf(Category);
            expect(category.name).toBe("blouse");
            expect(category.parent.name).toBe("tops");
        });
    });

    describe("CategoryService.getCategoryNames", () => {
        test("should return an array of category names", async () => {
            const categories = await categoryService.getCategoryNames();
            expect(categories).toBeInstanceOf(Array);
            expect(categories).toEqual(
                expect.arrayContaining([
                    "tops",
                    "bottoms",
                    "skirt",
                    "shorts",
                    "type",
                    "gender",
                    "female",
                    "male",
                    "unisex",
                    "blouse",
                    "tshirt",
                ])
            );
        });
    });

    describe("CategoryService.getAscendantCategories", () => {
        test("should return an array of categories if the category exists", async () => {
            const categories = await categoryService.getAscendantCategories(
                "10"
            );
            expect(categories).toBeInstanceOf(Array);
            expect(categories[0]).toBeInstanceOf(Category);
            const categoriesName = categories.map((category) => category.name);
            expect(categoriesName).toEqual(
                expect.arrayContaining(["type", "shorts", "bottoms"])
            );
        });

        test("should return an array of categories if the category exists", async () => {
            const categories = await categoryService.getAscendantCategories(
                "shorts"
            );
            expect(categories).toBeInstanceOf(Array);
            expect(categories[0]).toBeInstanceOf(Category);
            const categoriesName = categories.map((category) => category.name);
            expect(categoriesName).toEqual(
                expect.arrayContaining(["type", "shorts", "bottoms"])
            );
        });

        test("should return an empty array if the category does not exist", async () => {
            const categories = await categoryService.getAscendantCategories(
                "nonexistent"
            );
            expect(categories).toEqual([]);
        });
    });

    describe("CategoryService.getDescendantCategories", () => {
        test("should return an array of categories if the category exists", async () => {
            const categories = await categoryService.getDescendantCategories(
                "7"
            );
            expect(categories).toBeInstanceOf(Array);
            expect(categories[0]).toBeInstanceOf(Category);
            const categoriesName = categories.map((category) => category.name);
            expect(categoriesName).toEqual(
                expect.arrayContaining(["skirt", "shorts"])
            );
        });

        test("should return an empty array if the category does not exist", async () => {
            const categories = await categoryService.getDescendantCategories(
                "nonexistent"
            );
            expect(categories).toEqual([]);
        });
    });

    describe("CategoryService.getDescendantCategoriesByName", () => {
        test("should return an array of categories if the category exists", async () => {
            const categories =
                await categoryService.getDescendantCategoriesByName("bottoms");
            expect(categories).toBeInstanceOf(Array);

            expect(categories).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        name: "bottoms",
                    }),
                    expect.objectContaining({
                        name: "shorts",
                    }),
                    expect.objectContaining({
                        name: "skirt",
                    }),
                ])
            );
        });

        test("should throw an error if the category does not exist", async () => {
            await expect(
                categoryService.getDescendantCategoriesByName("nonexistent")
            ).rejects.toThrow(ResourceNotFoundError);
        });
    });

    describe("CategoryService.createCategory", () => {
        test("should create a new category", async () => {
            const categoryData = {
                name: "newCategory",
                parent: "bottoms",
            };

            const createdCategory = await categoryService.createCategory(
                categoryData
            );
            expect(createdCategory).toBeInstanceOf(Category);
            expect(createdCategory.name).toBe("newCategory");
            expect(createdCategory.parentID).toBe("7");
        });

        test("should throw an error if the parent category does not exist", async () => {
            const categoryData = {
                name: "newCategory",
                parent: "nonexistent",
            };

            await expect(
                categoryService.createCategory(categoryData)
            ).rejects.toThrow(ResourceNotFoundError);
        });
    });

    describe("CategoryService.updateCategory", () => {
        test("should update an existing category", async () => {
            const categoryData = {
                name: "notmale",
                description: "it is a category",
                parent: "tops",
            };

            const updatedCategory = await categoryService.updateCategory(
                "male",
                categoryData
            );
            expect(updatedCategory).toBeInstanceOf(Category);
            expect(updatedCategory.name).toBe("notmale");
            expect(updatedCategory.description).toBe("it is a category");
            expect(updatedCategory.parentID).toBe("6");
        });

        test("should throw an error if the category does not exist", async () => {
            const categoryData = {
                name: "shorts",
                parent: "tops",
            };

            await expect(
                categoryService.updateCategory("nonexistent", categoryData)
            ).rejects.toThrow(ResourceNotFoundError);
        });

        test("should throw an error if the parent category does not exist", async () => {
            const categoryData = {
                name: "shorts",
                parent: "nonexistent",
            };

            await expect(
                categoryService.updateCategory("shorts", categoryData)
            ).rejects.toThrow(ResourceNotFoundError);
        });

        test("should set null for fields that are null", async () => {
            const categoryData = {
                name: "unisex",
                description: null,
                parentID: null,
            };

            const updatedCategory = await categoryService.updateCategory(
                "unisex",
                categoryData
            );
            expect(updatedCategory).toBeInstanceOf(Category);
            expect(updatedCategory.name).toBe("unisex");
            expect(updatedCategory.description).toBeNull();
            expect(updatedCategory.parentID).toBeNull();
        });
    });

    describe("CategoryService.deleteCategory", () => {
        test("should delete an existing category", async () => {
            const categoryName = "female";
            await categoryService.deleteCategory(categoryName);

            // Verify that the category no longer exists
            await expect(
                categoryService.getCategory(categoryName)
            ).rejects.toThrow(ResourceNotFoundError);
        });

        test("should throw an error if the category does not exist", async () => {
            const categoryName = "nonexistent";
            await expect(
                categoryService.deleteCategory(categoryName)
            ).rejects.toThrow(ResourceNotFoundError);
        });
    });
});
