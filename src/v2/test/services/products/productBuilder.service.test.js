import { Product } from "../../../models/products/product.model.js";
import productBuilderService from "../../../services/products/productBuilder.service.js";
import seedData from "../../../seedData.js";

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
            imageURLs: null,
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
            imageURLs: null,
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
        const productBuilder = await productBuilderService.productBuilder(1);

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
        const productBuilder = await productBuilderService.productBuilder(1);

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
    test("should return the same product builder object if imageURLs is not provided", async () => {
        const productBuilder = await productBuilderService.productBuilder(1);

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
    test("should throw an error if product is not set", async () => {
        const productBuilder = await productBuilderService.productBuilder();

        try {
            await productBuilder.setDefaultVariant();
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    });

    test("should throw an error if variants is not set", async () => {
        const productBuilder = await productBuilderService.productBuilder(1);

        try {
            await productBuilder.setDefaultVariant();
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    });
});

describe("ProductBuilderService.productBuilder.build", () => {
    test("should return the object without empty fields", async () => {
        const productBuilder = await productBuilderService.productBuilder(1);

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
                    name: "variant1",
                    price: 10,
                    size: "M",
                    color: "red",
                    sku: "sku1",
                    stock: 10,
                },
                {
                    name: "variant2",
                    price: 20,
                    size: "L",
                    color: "blue",
                    sku: "sku2",
                    stock: 20,
                },
            ];
            const categories = ["Tops", "Male"];
            const imageURLs = [
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
                imageURLs
            );

            expect(result).toEqual({
                productID: expect.any(String),
                name: "product1",
                description: "description1",
                defaultVariant: {
                    variantID: expect.any(String),
                    name: "variant1",
                    price: 10,
                    size: "M",
                    color: "red",
                    sku: "sku1",
                    stock: 10,
                },
                variants: [
                    {
                        variantID: expect.any(String),
                        name: "variant1",
                        price: 10,
                        size: "M",
                        color: "red",
                        sku: "sku1",
                        stock: 10,
                    },
                    {
                        variantID: expect.any(String),
                        name: "variant2",
                        price: 20,
                        size: "L",
                        color: "blue",
                        sku: "sku2",
                        stock: 20,
                    },
                ],
                imageURLs: [
                    {
                        imageID: expect.any(String),
                        imagePath: "image1",
                        displayOrder: 1,
                    },
                    {
                        imageID: expect.any(String),
                        imagePath: "image2",
                        displayOrder: 2,
                    },
                ],
                categories: ["Tops", "Male"],
            });
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

            expect(result).toEqual({
                product: {
                    productID: "1",
                    name: "Crew Neck Short Sleeve T-Shirt",
                    description:
                        "A simple crew neck short sleeve t-shirt for everyday wear",
                    defaultVariantID: expect.any(String),
                    imageURLs: [
                        {
                            imageID: expect.any(String),
                            imagePath: "image3",
                            displayOrder: 3,
                        },
                        {
                            imageID: expect.any(String),
                            imagePath: "image4",
                            displayOrder: 4,
                        },
                    ],
                },
            });
        });
    });

    describe("productBuilderService.addVariants", () => {
        test("should return a result object", async () => {
            const variants = [
                {
                    name: "variant3",
                    price: 30,
                    size: "S",
                    color: "green",
                    sku: "sku3",
                    stock: 10,
                },
                {
                    name: "variant4",
                    price: 40,
                    size: "XL",
                    color: "black",
                    sku: "sku4",
                    stock: 20,
                },
            ];

            const result = await productBuilderService.addVariants(
                "1",
                variants
            );

            expect(result).toEqual({
                product: {
                    productID: "1",
                    name: "Crew Neck Short Sleeve T-Shirt",
                    description:
                        "A simple crew neck short sleeve t-shirt for everyday wear",
                    defaultVariantID: expect.any(String),
                    variants: [
                        {
                            variantID: expect.any(String),
                            name: "variant3",
                            price: 30,
                            size: "S",
                            color: "green",
                            sku: "sku3",
                            stock: 10,
                        },
                        {
                            variantID: expect.any(String),
                            name: "variant4",
                            price: 40,
                            size: "XL",
                            color: "black",
                            sku: "sku4",
                            stock: 20,
                        },
                    ],
                },
            });
        });
    });

    describe("productBuilderService.addCategories", () => {
        test("should return a result object", async () => {
            const categories = ["Tops", "Male"];

            const result = await productBuilderService.addCategories(
                "1",
                categories
            );

            expect(result).toEqual({
                product: {
                    productID: "1",
                    name: "Crew Neck Short Sleeve T-Shirt",
                    description:
                        "A simple crew neck short sleeve t-shirt for everyday wear",
                    defaultVariantID: expect.any(String),
                    categories: ["Tops", "Male"],
                },
            });
        });
    });
});
