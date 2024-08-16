import variantService from "../../../../services/products/variant.service.js";
import seedData from "../../../../seedData.js";
import Variant from "../../../../models/products/variant.model.js";
import {
    ResourceNotFoundError,
    BadRequestError,
} from "../../../../utils/error.js";
import Product from "../../../../models/products/product.model.js";
import AttributeValue from "../../../../models/products/attributeValue.model.js";
import ProductImage from "../../../../models/products/productImage.model.js";

beforeAll(async () => {
    await seedData();
}, 15000);

describe("Variant Service", () => {
    describe("getVariants", () => {
        test("should return all variants", async () => {
            const { variants } = await variantService.getVariants({}, {});

            expect(variants).toBeInstanceOf(Array);
            expect(variants.length).toBeGreaterThan(0);
            expect(variants[0]).toBeInstanceOf(Variant);
            expect(variants[0].image).toBeInstanceOf(ProductImage);
            expect(variants[0].attributeValues[0]).toBeInstanceOf(
                AttributeValue
            );
        });

        test("should return all variants with includeDeleted option", async () => {
            const { variants } = await variantService.getVariants(
                {
                    size: 100,
                },
                {
                    includeDeleted: true,
                }
            );
            expect(variants).toBeInstanceOf(Array);
            expect(variants.some((v) => v.deletedAt)).toBe(true);
        });

        // Filtering
        test("should return all variants with the given productID", async () => {
            const productID = "1";
            const { variants } = await variantService.getVariants({
                productID,
            });

            expect(variants).toBeInstanceOf(Array);
            expect(variants.length).toBeGreaterThan(0);
            expect(variants.every((v) => v.productID === productID)).toBe(true);
        });

        test("should return all variants with multiple filtering options", async () => {
            const { variants } = await variantService.getVariants({
                price: "[lte]60",
                stock: "[gte]5",
                discountPrice: "[between]20,60",
            });

            expect(variants).toBeInstanceOf(Array);
            expect(variants.length).toBeGreaterThan(0);
            expect(variants.every((v) => v.price <= 60)).toBe(true);
            expect(variants.every((v) => v.stock >= 5)).toBe(true);
            expect(
                variants.every(
                    (v) => v.discountPrice >= 20 && v.discountPrice <= 60
                )
            ).toBe(true);
        });

        test("should return all variants with the given attribute values", async () => {
            const { variants } = await variantService.getVariants({
                attributes: {
                    color: "red",
                    size: "M",
                },
            });

            expect(variants).toBeInstanceOf(Array);
            expect(variants.length).toBeGreaterThan(0);
            expect(
                variants.every(
                    (v) =>
                        v.attributeValues.some(
                            (av) =>
                                av.attribute.name === "color" &&
                                av.value === "red"
                        ) &&
                        v.attributeValues.some(
                            (av) =>
                                av.attribute.name === "size" && av.value === "M"
                        )
                )
            ).toBe(true);
        });

        // Sorting
        test("should return all variants with the given sorting options", async () => {
            const { variants } = await variantService.getVariants({
                size: 20,
                sort: ["price"],
            });

            expect(variants).toBeInstanceOf(Array);
            expect(variants.length).toBeGreaterThan(0);
            for (let i = 0; i < variants.length - 1; i++) {
                expect(variants[i].price <= variants[i + 1].price).toBe(true);
            }
        });

        test("should return all variants with the given sorting options in descending order", async () => {
            const { variants } = await variantService.getVariants({
                size: 20,
                sort: ["-price", "stock"],
            });

            expect(variants).toBeInstanceOf(Array);
            expect(variants.length).toBeGreaterThan(0);
            for (let i = 0; i < variants.length - 1; i++) {
                expect(variants[i].price >= variants[i + 1].price).toBe(true);
                if (variants[i].price === variants[i + 1].price) {
                    expect(variants[i].stock <= variants[i + 1].stock).toBe(
                        true
                    );
                }
            }
        });

        // Pagination
        test("should return all variants with the given pagination options", async () => {
            const { variants, totalItems, totalPages, currentPage } =
                await variantService.getVariants({
                    page: 1,
                    size: 6,
                });

            expect(variants).toBeInstanceOf(Array);
            expect(variants.length).toBe(6);
            expect(totalItems).toBeGreaterThanOrEqual(6);
            expect(totalPages).toBeGreaterThan(1);
            expect(currentPage).toBe(1);
        });

        test("should return all variants with the given pagination options 2", async () => {
            const { variants, totalItems, totalPages, currentPage } =
                await variantService.getVariants({
                    page: 3,
                    size: 3,
                });

            expect(variants).toBeInstanceOf(Array);
            expect(variants.length).toBe(3);
            expect(totalItems).toBeGreaterThanOrEqual(9);
            expect(totalPages).toBeGreaterThan(3);
            expect(currentPage).toBe(3);
        });

        test("should return all variants with the default pagination options", async () => {
            const { variants, totalItems, totalPages, currentPage } =
                await variantService.getVariants({});

            expect(variants).toBeInstanceOf(Array);
            expect(variants.length).toBe(5);
            expect(totalItems).toBeGreaterThanOrEqual(5);
            expect(totalPages).toBeGreaterThanOrEqual(1);
            expect(currentPage).toBe(1);
        });

        //Filtering, sorting, pagination
        test("should return all variants with the given filtering, sorting, and pagination options", async () => {
            const { variants, totalItems, totalPages, currentPage } =
                await variantService.getVariants({
                    price: "[lte]50",
                    stock: "[gte]10",
                    attributes: {
                        color: ["red", "black"],
                        size: ["M", "S"],
                    },
                    sort: ["-price"],
                    page: 1,
                    size: 3,
                });

            expect(variants).toBeInstanceOf(Array);
            expect(variants.length).toBe(3);
            expect(totalItems).toBeGreaterThanOrEqual(3);
            expect(totalPages).toBeGreaterThanOrEqual(1);
            expect(currentPage).toBe(1);
            expect(variants.every((v) => v.price <= 50)).toBe(true);
            expect(variants.every((v) => v.stock >= 10)).toBe(true);
            expect(
                variants.every(
                    (v) =>
                        v.attributeValues.some(
                            (av) =>
                                av.attribute.name === "color" &&
                                ["red", "black"].includes(av.value)
                        ) &&
                        v.attributeValues.some(
                            (av) =>
                                av.attribute.name === "size" &&
                                ["M", "S"].includes(av.value)
                        )
                )
            ).toBe(true);
            expect(
                variants.every((v, i) =>
                    i === 0 ? true : v.price <= variants[i - 1].price
                )
            ).toBe(true);

            // Assert sorting through pages
            const { variants: variants2 } = await variantService.getVariants({
                price: "[lte]50",
                stock: "[gte]10",
                attributes: {
                    color: ["red", "black"],
                    size: ["M", "S"],
                },
                sort: ["-price"],
                page: 2,
                size: 3,
            });

            expect(variants2).toBeInstanceOf(Array);
            expect(variants2.length).toBe(3);
            expect(variants2[0].price).toBeLessThanOrEqual(variants[2].price);
        });
    });

    describe("getVariant", () => {
        test("should return the variant", async () => {
            const variantID = "101";

            const variant = await variantService.getVariant(variantID);

            expect(variant).toBeInstanceOf(Variant);
            expect(variant.variantID).toBe(variantID);
            expect(variant.image).toBeInstanceOf(ProductImage);
            expect(variant.attributeValues[0]).toBeInstanceOf(AttributeValue);
        });

        test("should return the variant with the includeDeleted options", async () => {
            const variantID = "100";

            const variant = await variantService.getVariant(variantID, {
                includeDeleted: true,
            });

            expect(variant).toBeInstanceOf(Variant);
            expect(variant.deletedAt).not.toBeNull();
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
            const variantID = "102";
            const variantData = {
                name: "New variant name",
                price: 2000,
                discountPrice: 1800,
            };

            const updatedVariant = await variantService.updateVariant(
                variantID,
                variantData
            );

            expect(updatedVariant).toBeInstanceOf(Variant);
            expect(updatedVariant.variantID).toBe(variantID);
            expect(updatedVariant.name).toBe(variantData.name);
            expect(updatedVariant.price).toBe(variantData.price);
            expect(updatedVariant.discountPrice).toBe(
                variantData.discountPrice
            );
        });

        test("should update the attributes of a variant", async () => {
            const variantID = "102";
            const variantData = {
                attributes: {
                    color: "blue",
                    size: "L",
                },
            };

            const updatedVariant = await variantService.updateVariant(
                variantID,
                variantData
            );

            expect(updatedVariant).toBeInstanceOf(Variant);
            expect(updatedVariant.variantID).toBe(variantID);
            expect(updatedVariant.attributeValues[0]).toBeInstanceOf(
                AttributeValue
            );
            expect(updatedVariant.attributeValues[0].value).toBe(
                variantData.attributes.color
            );
        });

        test("should throw ResourceNotFoundError if the variant is not found", async () => {
            const variantID = "001";
            const variantData = { price: 2000 };

            await expect(
                variantService.updateVariant(variantID, variantData)
            ).rejects.toThrow(ResourceNotFoundError);
        });

        test("should throw BadRequestError if the discountPrice is smaller than original price", async () => {
            const variantID = "102";
            const variantData = { discountPrice: 10000 };

            await expect(
                variantService.updateVariant(variantID, variantData)
            ).rejects.toThrow(BadRequestError);
        });

        test("should update the imageID of a variant", async () => {
            const variantID = "102";
            const variantData = { imageID: "101" };

            const updatedVariant = await variantService.updateVariant(
                variantID,
                variantData
            );

            expect(updatedVariant).toBeInstanceOf(Variant);
            expect(updatedVariant.variantID).toBe(variantID);
            expect(updatedVariant.imageID).toBe(variantData.imageID);
        });

        test("should throw ResourceNotFoundError if the image is not found", async () => {
            const variantID = "102";
            const variantData = { imageID: "201" };

            await expect(
                variantService.updateVariant(variantID, variantData)
            ).rejects.toThrow(ResourceNotFoundError);
        });
    });

    describe("deleteVariant", () => {
        test("should delete a variant with the given variantID", async () => {
            const variantID = "603";

            await variantService.deleteVariant(variantID);

            // Verify that the variant is deleted
            await expect(variantService.getVariant(variantID)).rejects.toThrow(
                ResourceNotFoundError
            );

            const variant = await variantService.getVariant(variantID, {
                includeDeleted: true,
            });
            expect(variant).toBeInstanceOf(Variant);
            expect(variant.deletedAt).not.toBeNull();
        });

        test("should throw ResourceNotFoundError if the variant is not found", async () => {
            const variantID = "2001";

            await expect(
                variantService.deleteVariant(variantID)
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

    describe("getProductVariant", () => {
        test("should return the variant of the product", async () => {
            const productID = "1";
            const variantID = "101";

            const variant = await variantService.getProductVariant(
                productID,
                variantID
            );

            expect(variant).toBeInstanceOf(Variant);
            expect(variant.productID).toBe(productID);
            expect(variant.variantID).toBe(variantID);
        });

        test("should throw ResourceNotFoundError if the product or variant is not found", async () => {
            const productID = "70";
            const variantID = "101";

            await expect(
                variantService.getProductVariant(productID, variantID)
            ).rejects.toThrow(ResourceNotFoundError);
        });

        test("should throw ResourceNotFoundError if the variant is not found", async () => {
            const productID = "1";
            const variantID = "201";

            await expect(
                variantService.getProductVariant(productID, variantID)
            ).rejects.toThrow(ResourceNotFoundError);
        });
    });

    describe("createVariantForProduct", () => {
        test("should create a variant for a product and return the added variant", async () => {
            const product = await Product.findByPk("1");
            const variantData = {
                name: "New variant",
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
            expect(addedVariant.name).toBe(variantData.name);
            expect(addedVariant.price).toBe(variantData.price);
            expect(addedVariant.stock).toBe(variantData.stock);
            expect(addedVariant.sku).toBe(variantData.sku);

            expect(addedVariant.attributeValues[0]).toBeInstanceOf(
                AttributeValue
            );
        });

        test("should set the variant name to the product name if not provided", async () => {
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

            expect(addedVariant.name).toBe(product.name);
        });
    });
});
