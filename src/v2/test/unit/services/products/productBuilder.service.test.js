import Product from "../../../../models/products/product.model.js";
import productBuilderService from "../../../../services/products/productBuilder.service.js";
import seedData from "../../../../seedData.js";
import Variant from "../../../../models/products/variant.model.js";
import { db } from "../../../../models/index.model.js";

beforeAll(async () => {
    await seedData();
});

afterAll(async () => {
    await db.close();
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
                imagesBuffer: null,
                setProductInfo: expect.any(Function),
                setVariants: expect.any(Function),
                setCategories: expect.any(Function),
                uploadImages: expect.any(Function),
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
                imagesBuffer: null,
                setProductInfo: expect.any(Function),
                setVariants: expect.any(Function),
                setCategories: expect.any(Function),
                setImages: expect.any(Function),
                uploadImages: expect.any(Function),
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
                    mimetype: "image/png",
                    buffer: Buffer.from("image1"),
                },
                {
                    mimetype: "image/png",
                    buffer: Buffer.from("image2"),
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
                    mimetype: "image/png",
                    buffer: Buffer.from("image1"),
                },
                {
                    mimetype: "image/bmp",
                    buffer: Buffer.from("image2"),
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
                        contentType: "image/png",
                        displayOrder: 1,
                    }),
                    expect.objectContaining({
                        contentType: "image/bmp",
                        displayOrder: 2,
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

        test("should throw an error if variant's sku is not unique", async () => {
            const productInfo = {
                name: "product2",
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

            try {
                await productBuilderService.addProduct(
                    productInfo,
                    variants,
                    [],
                    []
                );
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
            }

            const product = await Product.findOne({
                where: {
                    name: "product2",
                },
            });

            expect(product).toBeNull();
        });
    });

    describe("productBuilderService.addImage", () => {
        test("should return a result object", async () => {
            const imagesData = [
                {
                    mimetype: "image/png",
                    buffer: Buffer.from("image3"),
                },
                {
                    mimetype: "image/jpg",
                    buffer: Buffer.from("image4"),
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
                        contentType: "image/png",
                    }),
                    expect.objectContaining({
                        contentType: "image/jpg",
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

        test("should throw an error if variant's sku is not unique", async () => {
            const variants = [
                {
                    price: 50,
                    sku: "sku3",
                    stock: 10,
                    attributes: {
                        size: "M",
                        color: "white",
                    },
                },
                {
                    price: 60,
                    sku: "sku5",
                    stock: 20,
                    attributes: {
                        size: "L",
                        color: "black",
                    },
                },
            ];

            try {
                await productBuilderService.addVariants("1", variants);
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
            }

            const variant = await Variant.findOne({
                where: {
                    sku: "sku5",
                },
            });

            expect(variant).toBeNull();
        });

        test("should ignore images that are not associated with a variant", async () => {
            const variants = [
                {
                    price: 70,
                    sku: "sku6",
                    stock: 10,
                    attributes: {
                        size: "M",
                        color: "white",
                    },
                },
                {
                    price: 80,
                    sku: "sku7",
                    stock: 20,
                    attributes: {
                        size: "L",
                        color: "black",
                    },
                },
            ];

            const images = [
                {
                    mimetype: "image/png",
                    buffer: Buffer.from("image5"),
                },
                {
                    mimetype: "image/jpg",
                    buffer: Buffer.from("image6"),
                },
            ];

            const result = await productBuilderService.addVariants(
                "1",
                variants,
                images
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
                        sku: "sku6",
                    }),
                    expect.objectContaining({
                        sku: "sku7",
                    }),
                ])
            );

            expect(result.images).toEqual(
                expect.toBeOneOf([null, [], undefined])
            );
        });
    });

    describe("productBuilderService.addCategories", () => {
        test("should return a result object", async () => {
            const categories = ["gender", "type"];

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
                    expect.objectContaining({ name: "gender" }),
                    expect.objectContaining({ name: "type" }),
                ])
            );
        });

        test("should not add categories that already exist", async () => {
            const categories = ["gender", "type"];

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
                })
            );

            expect(result.categories).toEqual(
                expect.toBeOneOf([null, [], undefined])
            );
        });
    });
});
