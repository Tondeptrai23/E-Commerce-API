import { Product } from "../../../models/products/product.model.js";
import productBuilderService from "../../../services/products/productBuilder.service.js";
import seedData from "../../../seedData.js";

beforeAll(async () => {
    await seedData();
});

describe("productBuilderService", () => {
    /**
     * Test suite for productBuilderService.productBuilder
     * Only testing the return values of the functions or if they throw an error/edge cases
     * The actual functionality of the functions are tested in the productBuilderService.addXXX functions
     */
    describe("productBuilderService.productBuilder", () => {
        test("should return a product builder object", async () => {
            const productBuilder = await productBuilderService.productBuilder();
            expect(productBuilder).toEqual({
                product: null,
                variants: null,
                categories: null,
                images: null,
                setProductInfo: expect.any(Function),
                setVariants: expect.any(Function),
                setCategories: expect.any(Function),
                setImages: expect.any(Function),
                setDefaultVariant: expect.any(Function),
                build: expect.any(Function),
            });
        });

        test("should return a product object", async () => {
            const builder = await productBuilderService.productBuilder(1);
            expect(builder).toEqual({
                product: expect.any(Product),
                variants: null,
                categories: null,
                images: null,
                setProductInfo: expect.any(Function),
                setVariants: expect.any(Function),
                setCategories: expect.any(Function),
                setImages: expect.any(Function),
                setDefaultVariant: expect.any(Function),
                build: expect.any(Function),
            });
        });
    });

    describe("productBuilderService.productBuilder.setProductInfo", () => {
        test("should return the same product builder object if productInfo is not provided", async () => {
            const productBuilder = await productBuilderService.productBuilder();
            const builder = await productBuilder.setProductInfo();
            expect(builder).toEqual(productBuilder);
        });
    });

    describe("ProductBuilderService.productBuilder.setVariants", () => {
        test("should return the same product builder object if variants is not provided", async () => {
            const productBuilder = await productBuilderService.productBuilder(
                1
            );

            let builder = await productBuilder.setVariants();
            expect(builder).toEqual(productBuilder);
        });

        test("should throw an error if product is not set", async () => {
            const productBuilder = await productBuilderService.productBuilder();
            const variants = [
                { name: "variant1", price: 10 },
                { name: "variant2", price: 20 },
            ];

            try {
                await productBuilder.setVariants(variants);
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
            }
        });
    });

    describe("ProductBuilderService.productBuilder.setCategories", () => {
        test("should return the same product builder object if categories is not provided", async () => {
            const productBuilder = await productBuilderService.productBuilder(
                1
            );

            let builder = await productBuilder.setCategories();
            expect(builder).toEqual(productBuilder);
        });

        test("should throw an error if product is not set", async () => {
            const productBuilder = await productBuilderService.productBuilder();
            const categories = ["category1", "category2"];

            try {
                await productBuilder.setCategories(categories);
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
            }
        });
    });

    describe("ProductBuilderService.productBuilder.setImages", () => {
        test("should return the same product builder object if images is not provided", async () => {
            const productBuilder = await productBuilderService.productBuilder(
                1
            );

            let builder = await productBuilder.setImages();
            expect(builder).toEqual(productBuilder);
        });

        test("should throw an error if product is not set", async () => {
            const productBuilder = await productBuilderService.productBuilder();
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

            try {
                await productBuilder.setImages(images);
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
            }
        });
    });

    describe("ProductBuilderService.productBuilder.setDefaultVariant", () => {
        test("should set the default variant of the product", async () => {
            let productBuilder = await productBuilderService.productBuilder(1);
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

            productBuilder = await productBuilder.setVariants(variants);
            productBuilder = await productBuilder.setDefaultVariant();

            expect(productBuilder.product.defaultVariantID).toEqual(
                productBuilder.variants[0].variantID
            );
        });

        test("should throw an error if product is not set", async () => {
            const productBuilder = await productBuilderService.productBuilder();

            try {
                await productBuilder.setDefaultVariant();
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
            }
        });

        test("should throw an error if variants is not set", async () => {
            const productBuilder = await productBuilderService.productBuilder(
                1
            );

            try {
                await productBuilder.setDefaultVariant();
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
            }
        });
    });

    describe("ProductBuilderService.productBuilder.build", () => {
        test("should return the object without empty fields", async () => {
            const productBuilder = await productBuilderService.productBuilder(
                1
            );

            const product = await productBuilder.build();
            expect(product.productID).toEqual("1");
            for (const key in product) {
                expect(product[key]).not.toEqual(null);
                expect(product[key]).not.toEqual([]);
                expect(product[key]).not.toEqual("");
                expect(product[key]).not.toEqual({});
            }
        });
    });

    /**
     *
     * The tests for productBuilderService.addXXX
     *
     */
    describe("productBuilderService.addXXX", () => {
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

        describe("productBuilderService.addImage", () => {
            test("should return a result object", async () => {
                const imagesData = [
                    {
                        imagePath: "image3",
                        displayOrder: 3,
                    },
                    {
                        imagePath: "image4",
                        displayOrder: 4,
                    },
                ];

                const result = await productBuilderService.addImages(
                    "1",
                    imagesData
                );

                expect(result).toEqual(
                    expect.objectContaining({
                        productID: "1",
                        name: "Crew Neck Short Sleeve T-Shirt",
                        description:
                            "A simple crew neck short sleeve t-shirt for everyday wear",
                        defaultVariantID: expect.any(String),
                        images: expect.any(Array),
                    })
                );

                expect(result.images).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            imagePath: "image3",
                        }),
                        expect.objectContaining({
                            imagePath: "image4",
                        }),
                    ])
                );
            });
        });

        describe("productBuilderService.addVariants", () => {
            test("should return a result object", async () => {
                const variants = [
                    {
                        price: 30,
                        sku: "sku3",
                        stock: 10,
                        attributes: {
                            size: "M",
                            color: "white",
                        },
                    },
                    {
                        price: 40,
                        sku: "sku4",
                        stock: 20,
                        attributes: {
                            size: "L",
                            color: "black",
                        },
                    },
                ];

                const result = await productBuilderService.addVariants(
                    "1",
                    variants
                );

                expect(result).toEqual(
                    expect.objectContaining({
                        productID: "1",
                        name: "Crew Neck Short Sleeve T-Shirt",
                        description:
                            "A simple crew neck short sleeve t-shirt for everyday wear",
                        defaultVariantID: expect.any(String),
                        variants: expect.any(Array),
                    })
                );

                expect(result.variants).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            sku: "sku3",
                        }),
                        expect.objectContaining({
                            sku: "sku4",
                        }),
                    ])
                );
            });
        });

        describe("productBuilderService.addCategories", () => {
            test("should return a result object", async () => {
                const categories = ["Tops", "Male"];

                const result = await productBuilderService.addCategories(
                    "1",
                    categories
                );

                expect(result).toEqual(
                    expect.objectContaining({
                        productID: "1",
                        name: "Crew Neck Short Sleeve T-Shirt",
                        description:
                            "A simple crew neck short sleeve t-shirt for everyday wear",
                        defaultVariantID: expect.any(String),
                        categories: expect.any(Array),
                    })
                );

                expect(result.categories).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({ name: "Tops" }),
                        expect.objectContaining({ name: "Male" }),
                    ])
                );
            });
        });
    });
});
