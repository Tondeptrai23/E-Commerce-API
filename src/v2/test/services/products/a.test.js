import { Product } from "../../../models/products/product.model.js";
import productBuilderService from "../../../services/products/productBuilder.service.js";
import seedData from "../../../seedData.js";

beforeAll(async () => {
    await seedData();
});

describe("productBuilderService.addProduct", () => {
    test("should return a product object", async () => {
        const productInfo = {
            name: "product1",
            description: "description1",
        };
        const variants = [
            {
                price: 10,
                sku: "sku1",
                stock: 10,
                attributes: {
                    size: "M",
                    color: "red",
                },
            },
            {
                price: 20,
                sku: "sku2",
                stock: 20,
                attributes: {
                    size: "L",
                    color: "blue",
                },
            },
        ];
        const categories = ["Tops", "Male"];
        const images = [
            {
                imagePath: "image1",
                displayOrder: 1,
            },
            {
                imagePath: "image2",
                displayOrder: 2,
            },
        ];

        const result = await productBuilderService.addProduct(
            productInfo,
            variants,
            categories,
            images
        );
        expect(result.productID).toEqual(expect.any(String));
        expect(result.name).toBe("product1");
        expect(result.description).toBe("description1");
        expect(result.defaultVariantID).toEqual(expect.any(String));
        expect(Array.isArray(result.variants)).toBe(true);
        expect(Array.isArray(result.images)).toBe(true);
        expect(Array.isArray(result.categories)).toBe(true);

        expect(result.variants).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    sku: "sku1",
                }),
                expect.objectContaining({
                    sku: "sku2",
                }),
            ])
        );

        expect(result.images).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    imagePath: "image1",
                }),
                expect.objectContaining({
                    imagePath: "image2",
                }),
            ])
        );

        expect(result.categories).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ name: "Tops" }),
                expect.objectContaining({ name: "Male" }),
            ])
        );
    });
});
