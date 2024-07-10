import productCategoryService from "../../../services/products/productCategory.service.js";
import seedData from "../../../seedData.js";
import { Category } from "../../../models/products/category.model.js";
import { ResourceNotFoundError } from "../../../utils/error.js";

beforeAll(async () => {
    await seedData();
});

describe("Product Category Service", () => {
    describe("updateCategory", () => {
        test("should update the categories of a product", async () => {
            const productID = "1";
            const categories = ["bottoms", "female"];

            const updatedProduct = await productCategoryService.updateCategory(
                productID,
                categories
            );

            const updatedCategories = updatedProduct.categories.map(
                (c) => c.name
            );
            expect(updatedCategories).toEqual(
                expect.arrayContaining(categories)
            );
        });

        test("should throw ResourceNotFoundError if the product is not found", async () => {
            const productID = "123";
            const categories = ["bottoms", "female"];

            await expect(
                productCategoryService.updateCategory(productID, categories)
            ).rejects.toThrow(ResourceNotFoundError);
        });
    });

    describe("deleteCategory", () => {
        test("should delete a category from a product", async () => {
            const productID = "2";
            const categoryName = "unisex";

            await productCategoryService.deleteCategory(
                productID,
                categoryName
            );

            let productCategories =
                await productCategoryService.getProductCategories(productID);

            productCategories.map((pc) => pc.name);
            expect(productCategories).not.toContain(categoryName);
        });

        test("should throw ResourceNotFoundError if the product is not found", async () => {
            const productID = "789";
            const categoryID = "123";

            await expect(
                productCategoryService.deleteCategory(productID, categoryID)
            ).rejects.toThrow(ResourceNotFoundError);
        });

        test("should throw ResourceNotFoundError if the category is not found", async () => {
            const productID2 = "123";
            const categoryID2 = "789";

            await expect(
                productCategoryService.deleteCategory(productID2, categoryID2)
            ).rejects.toThrow(ResourceNotFoundError);
        });
    });

    describe("getProductCategories", () => {
        test("should return an array of categories for a product", async () => {
            const productID = "3";

            const productCategories =
                await productCategoryService.getProductCategories(productID);

            expect(Array.isArray(productCategories)).toBe(true);
            expect(
                productCategories.every(
                    (category) => category instanceof Category
                )
            ).toBe(true);
        });

        test("should throw ResourceNotFoundError if the product is not found", async () => {
            const productID = "456";

            await expect(
                productCategoryService.getProductCategories(productID)
            ).rejects.toThrow(ResourceNotFoundError);
        });
    });
});
