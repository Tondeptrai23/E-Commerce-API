import variantService from "../../../services/products/variant.service.js";
import seedData from "../../../seedData.js";
import Variant from "../../../models/products/variant.model.js";
import { ResourceNotFoundError } from "../../../utils/error.js";
import Product from "../../../models/products/product.model.js";
import AttributeValue from "../../../models/products/attributeValue.model.js";

beforeAll(async () => {
    await seedData();
});

describe("Variant Service", () => {
    describe("getVariant", () => {
        test("should return the variant of a product", async () => {
            const productID = "1";
            const variantID = "102";

            const variant = await variantService.getVariant(
                productID,
                variantID
            );

            expect(variant).toBeInstanceOf(Variant);
            expect(variant.productID).toBe(productID);
            expect(variant.variantID).toBe(variantID);
        });

        test("should throw ResourceNotFoundError if the product or variant is not found", async () => {
            const productID = "7";
            const variantID = "101";

            await expect(
                variantService.getVariant(productID, variantID)
            ).rejects.toThrow(ResourceNotFoundError);
        });
    });

    describe("updateVariant", () => {
        test("should update a variant and return the updated variant", async () => {
            const productID = "1";
            const variantID = "102";
            const variantData = { price: 20000 };

            const updatedVariant = await variantService.updateVariant(
                productID,
                variantID,
                variantData
            );

            expect(updatedVariant).toBeInstanceOf(Variant);
            expect(updatedVariant.productID).toBe(productID);
            expect(updatedVariant.variantID).toBe(variantID);
            expect(updatedVariant.price).toBe(variantData.price);
        });

        test("should throw ResourceNotFoundError if the product or variant is not found", async () => {
            const productID = "1";
            const variantID = "201";
            const variantData = { price: 20000 };

            await expect(
                variantService.updateVariant(productID, variantID, variantData)
            ).rejects.toThrow(ResourceNotFoundError);
        });
    });

    describe("deleteVariant", () => {
        test("should delete a variant with the given productID and variantID", async () => {
            const productID = "1";
            const variantID = "101";

            await variantService.deleteVariant(productID, variantID);

            // Verify that the variant is deleted
            await expect(
                variantService.getVariant(productID, variantID)
            ).rejects.toThrow(ResourceNotFoundError);
        });

        test("should throw ResourceNotFoundError if the product or variant is not found", async () => {
            const productID = "1";
            const variantID = "201";

            await expect(
                variantService.deleteVariant(productID, variantID)
            ).rejects.toThrow(ResourceNotFoundError);
        });
    });

    describe("getProductVariants", () => {
        test("should return all variants of a product", async () => {
            const productID = "1";

            const variants = await variantService.getProductVariants(productID);

            expect(variants).toBeInstanceOf(Array);
            expect(variants.length).toBeGreaterThan(0);
            expect(variants[0]).toBeInstanceOf(Variant);
            expect(variants[0].productID).toBe(productID);
        });

        test("should throw ResourceNotFoundError if the product is not found", async () => {
            const productID = "7";

            await expect(
                variantService.getProductVariants(productID)
            ).rejects.toThrow(ResourceNotFoundError);
        });
    });

    describe("createVariantForProduct", () => {
        test("should create a variant for a product and return the added variant", async () => {
            const product = await Product.findByPk("1");
            const variantData = {
                price: 100,
                stock: 10,
                sku: "SKU-001",
                attributes: {
                    color: "Red",
                    size: "M",
                },
            };

            const addedVariant = await variantService.createVariantForProduct(
                product,
                variantData
            );

            expect(addedVariant).toBeInstanceOf(Variant);
            expect(addedVariant.productID).toBe(product.productID);
            expect(addedVariant.price).toBe(variantData.price);
            expect(addedVariant.stock).toBe(variantData.stock);
            expect(addedVariant.sku).toBe(variantData.sku);

            expect(addedVariant.dataValues.attributeValues[0]).toBeInstanceOf(
                AttributeValue
            );
        });
    });
});
