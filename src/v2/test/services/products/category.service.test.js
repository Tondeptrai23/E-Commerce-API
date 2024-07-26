import categoryService from "../../../services/products/category.service.js";
import seedData from "../../../seedData.js";
import Category from "../../../models/products/category.model.js";

beforeAll(async () => {
    await seedData();
}, 15000);

describe("CategoryService", () => {
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
                expect.arrayContaining(["bottoms", "skirt", "shorts"])
            );
        });

        test("should return an empty array if the category does not exist", async () => {
            const categories =
                await categoryService.getDescendantCategoriesByName(
                    "nonexistent"
                );
            expect(categories).toEqual([]);
        });
    });
});
