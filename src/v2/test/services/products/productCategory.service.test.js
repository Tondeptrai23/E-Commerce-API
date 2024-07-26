import productCategoryService from "../../../services/products/productCategory.service.js";
import seedData from "../../../seedData.js";
import Category from "../../../models/products/category.model.js";
import { ResourceNotFoundError } from "../../../utils/error.js";
import Product from "../../../models/products/product.model.js";

beforeAll(async () => {
    await seedData();
}, 15000);

describe("Product Category Service", () => {
    describe("updateCategory", () => {
        test("should update the categories of a product", async () => {
            const productID = "3";
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
            const productID = "1";

            const productCategories =
                await productCategoryService.getProductCategories(productID);

            expect(Array.isArray(productCategories)).toBe(true);
            expect(
                productCategories.every(
                    (category) => category instanceof Category
                )
            ).toBe(true);
            expect(
                productCategories.every((category) => {
                    return (
                        category.name === "tops" || category.name === "unisex"
                    );
                })
            );
        });

        test("should throw ResourceNotFoundError if the product is not found", async () => {
            const productID = "456";

            await expect(
                productCategoryService.getProductCategories(productID)
            ).rejects.toThrow(ResourceNotFoundError);
        });
    });

    describe("getProductsByAncestorCategory", () => {
        test("should return an array of products for an ancestor category", async () => {
            const categoryName = "tops";

            const products =
                await productCategoryService.getProductsByAncestorCategory(
                    categoryName
                );

            expect(Array.isArray(products)).toBe(true);
            expect(products.length).toBeGreaterThan(0);
            expect(products.every((product) => product instanceof Product));
            expect(
                products.every((product) => {
                    return (
                        product.productID === 1 ||
                        product.productID === 5 ||
                        product.productID === 6
                    );
                })
            );
        });

        test("should throw ResourceNotFoundError if the category is not found", async () => {
            const categoryName = "123";

            await expect(
                productCategoryService.getProductsByAncestorCategory(
                    categoryName
                )
            ).rejects.toThrow(ResourceNotFoundError);
        });
    });

    describe("getProductCategoryTree", () => {
        test("should return a tree of categories for a product", async () => {
            const productID = "1";

            const categories =
                await productCategoryService.getProductCategoryTree(productID);

            expect(categories).toBeDefined();
            expect(categories).toBeInstanceOf(Array);
            expect(categories).toEqual(
                expect.arrayContaining([
                    "tops",
                    "unisex",
                    "gender",
                    "type",
                    "tshirt",
                ])
            );
        });

        test("should throw ResourceNotFoundError if the product is not found", async () => {
            const productID = "123";

            await expect(
                productCategoryService.getProductCategoryTree(productID)
            ).rejects.toThrow(ResourceNotFoundError);
        });
    });
});
