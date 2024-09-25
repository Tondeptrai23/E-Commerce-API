import CartSerializer from "../../../../services/serializers/cart.serializer.service.js";

describe("Cart Serializer", () => {
    test("should serialize cart", () => {
        const cart = {
            variantID: "variantID",
            productID: "productID",
            name: "name",
            price: 100,
            discountPrice: 90,
            extraField: "extraField",
            image: {
                imageID: "imageID",
                contentType: "image/png",
                extraField: "extraField",
            },
            cartItem: {
                cartItemID: "cartItemID",
                quantity: 2,
                extraField: "extraField",
            },
        };

        const serializedCart = CartSerializer.parse(cart);

        expect(serializedCart).toEqual({
            cartItemID: "cartItemID",
            variantID: "variantID",
            productID: "productID",
            name: "name",
            price: 100,
            discountPrice: 90,
            image: expect.stringContaining("imageID.png"),
            quantity: 2,
            totalPrice: 180,
        });
    });

    test("should serialize cart with missing optional fields", () => {
        const cart = {
            variantID: "variantID",
            productID: "productID",
            price: 50,
            cartItem: {
                cartItemID: "cartItemID",
                quantity: 3,
            },
        };

        const serializedCart = CartSerializer.parse(cart);

        expect(serializedCart).toEqual({
            cartItemID: "cartItemID",
            variantID: "variantID",
            productID: "productID",
            name: null,
            price: 50,
            image: null,
            discountPrice: null,
            quantity: 3,
            totalPrice: 150,
        });
    });

    test("should serialize cart array", () => {
        const carts = [
            {
                variantID: "variantID1",
                productID: "productID1",
                name: "name1",
                price: 100,
                discountPrice: 90,
                image: {
                    imageID: "imageID",
                    contentType: "image/png",
                },
                cartItem: {
                    cartItemID: "cartItemID1",
                    quantity: 2,
                },
            },
            {
                variantID: "variantID2",
                productID: "productID2",
                name: "name2",
                price: 50,
                cartItem: {
                    cartItemID: "cartItemID2",
                    quantity: 3,
                },
            },
        ];

        const serializedCarts = carts.map((cart) => CartSerializer.parse(cart));

        expect(serializedCarts).toEqual([
            {
                cartItemID: "cartItemID1",
                variantID: "variantID1",
                productID: "productID1",
                name: "name1",
                price: 100,
                discountPrice: 90,
                image: expect.stringContaining("imageID.png"),
                quantity: 2,
                totalPrice: 180,
            },
            {
                cartItemID: "cartItemID2",
                variantID: "variantID2",
                productID: "productID2",
                name: "name2",
                price: 50,
                discountPrice: null,
                image: null,
                quantity: 3,
                totalPrice: 150,
            },
        ]);
    });
});
