import categoryService from "../../../../services/products/category.service.js";
import seedData from "../../../../seedData.js";
import Category from "../../../../models/products/category.model.js";
import { ResourceNotFoundError } from "../../../../utils/error.js";
import { db } from "../../../../models/index.model.js";

beforeAll(async () => {
    await seedData();
});

afterAll(async () => {
    await db.close();
});

describe("getCategories", () => {
    test("should return an array of categories", async () => {
        const { categories, totalPages, currentPage, totalItems } =
            await categoryService.getCategories({});
        expect(categories).toBeInstanceOf(Array);
        expect(categories[0]).toBeInstanceOf(Category);
        expect(totalPages).toBeGreaterThan(0);
        expect(currentPage).toBe(1);
        expect(totalItems).toBeGreaterThan(0);
    });

    test("should return an array of categories with pagination", async () => {
        const { categories, totalPages, currentPage, totalItems } =
            await categoryService.getCategories({ page: "1", size: "5" });
        expect(categories).toBeInstanceOf(Array);
        expect(categories).toHaveLength(5);
        expect(categories[0]).toBeInstanceOf(Category);
        expect(totalPages).toBeGreaterThan(0);
        expect(currentPage).toBe(1);
        expect(totalItems).toBeGreaterThan(0);

        const { categories: categories2, currentPage: currentPage2 } =
            await categoryService.getCategories({ page: "2", size: "5" });
        expect(categories2).toBeInstanceOf(Array);
        expect(categories2.length).toBeLessThanOrEqual(5);
        expect(categories2[0]).toBeInstanceOf(Category);
        expect(currentPage2).toBe(2);
    });

    test("should return an array of categories with sorting", async () => {
        const { categories, totalPages, currentPage, totalItems } =
            await categoryService.getCategories({ sort: ["name"] });
        expect(categories).toBeInstanceOf(Array);
        expect(totalPages).toBeGreaterThan(0);
        expect(currentPage).toBe(1);
        expect(totalItems).toBeGreaterThan(0);

        for (let i = 0; i < categories.length - 1; i++) {
            expect(categories[i].name <= categories[i + 1].name).toBe(true);
        }

        const { categories: categories2 } = await categoryService.getCategories(
            {
                sort: ["name"],
                page: "2",
            }
        );
        expect(categories2).toBeInstanceOf(Array);
        expect(categories2[0].name > categories[4].name).toBe(true);
        for (let i = 0; i < categories2.length - 1; i++) {
            expect(categories2[i].name <= categories2[i + 1].name).toBe(true);
        }
    });

    test("should return an array of categories with filtering", async () => {
        const { categories, totalPages, currentPage, totalItems } =
            await categoryService.getCategories({ name: "tops" });
        expect(categories).toBeInstanceOf(Array);
        expect(categories).toHaveLength(1);
        expect(categories[0]).toBeInstanceOf(Category);
        expect(categories[0].name).toBe("tops");
        expect(totalPages).toBe(1);
        expect(currentPage).toBe(1);
        expect(totalItems).toBe(1);
    });

    test("should return an empty array if no categories match the filter", async () => {
        const { categories, totalPages, currentPage, totalItems } =
            await categoryService.getCategories({ name: "nonexistent" });
        expect(categories).toEqual([]);
        expect(totalPages).toBe(0);
        expect(currentPage).toBe(1);
        expect(totalItems).toBe(0);
    });
});

describe("getCategory", () => {
    test("should return a category if the category exists", async () => {
        const category = await categoryService.getCategory("blouse");
        expect(category).toBeInstanceOf(Category);
        expect(category.name).toBe("blouse");
        expect(category.parent.name).toBe("tops");
    });
});

describe("getCategoryNames", () => {
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

describe("getAscendantCategories", () => {
    test("should return an array of categories if the category exists", async () => {
        const categories = await categoryService.getAscendantCategories("10");
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

describe("getDescendantCategories", () => {
    test("should return an array of categories if the category exists", async () => {
        const categories = await categoryService.getDescendantCategories("7");
        expect(categories).toBeInstanceOf(Array);
        expect(categories[0]).toBeInstanceOf(Category);
        const categoriesName = categories.map((category) => category.name);
        expect(categoriesName).toEqual(
            expect.arrayContaining(["skirt", "shorts"])
        );
    });

    test("should return an array of categories if the category exists", async () => {
        const categories = await categoryService.getDescendantCategories(
            "bottoms"
        );
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
            categoryService.getDescendantCategories("nonexistent")
        ).rejects.toThrow(ResourceNotFoundError);
    });
});

describe("createCategory", () => {
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

describe("updateCategory", () => {
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

describe("deleteCategory", () => {
    test("should delete an existing category", async () => {
        const categoryName = "female";
        await categoryService.deleteCategory(categoryName);

        // Verify that the category no longer exists
        await expect(categoryService.getCategory(categoryName)).rejects.toThrow(
            ResourceNotFoundError
        );
    });

    test("should throw an error if the category does not exist", async () => {
        const categoryName = "nonexistent";
        await expect(
            categoryService.deleteCategory(categoryName)
        ).rejects.toThrow(ResourceNotFoundError);
    });
});
