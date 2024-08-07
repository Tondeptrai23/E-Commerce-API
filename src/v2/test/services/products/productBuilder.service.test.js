import Product from "../../../models/products/product.model.js";
import productBuilderService from "../../../services/products/productBuilder.service.js";
import seedData from "../../../seedData.js";

beforeAll(async () => {
    await seedData();
});

describe("ProductBuilderService", () => {
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
                    url: "image1",
                    thumbnail: "thumbnail1",
                },
                {
                    url: "image2",
                    thumbnail: "thumbnail2",
                },
            ];

            try {
                await productBuilder.setImages(images);
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
                const categories = ["tops", "male"];
                const images = [
                    {
                        url: "image1",
                        thumbnail: "thumbnail1",
                    },
                    {
                        url: "image2",
                        thumbnail: "thumbnail2",
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
                            url: "image1",
                        }),
                        expect.objectContaining({
                            url: "image2",
                        }),
                    ])
                );

                expect(result.categories).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({ name: "tops" }),
                        expect.objectContaining({ name: "male" }),
                    ])
                );
            });
        });

        describe("productBuilderService.addImage", () => {
            test("should return a result object", async () => {
                const imagesData = [
                    {
                        url: "image3",
                    },
                    {
                        url: "image4",
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
                        images: expect.any(Array),
                    })
                );

                expect(result.images).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            url: "image3",
                        }),
                        expect.objectContaining({
                            url: "image4",
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
                const categories = ["tops", "male"];

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
                        categories: expect.any(Array),
                    })
                );

                expect(result.categories).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({ name: "tops" }),
                        expect.objectContaining({ name: "male" }),
                    ])
                );
            });
        });
    });
});
