import CartSerializer from "../../../../services/serializers/cart.serializer.service.js";

describe("Cart Serializer", () => {
    test("should serialize cart", () => {
        const cart = {
            variantID: "variantID",
            productID: "productID",
            price: 100,
            discountPrice: 90,
            extraField: "extraField",
            image: {
                url: "imageURL",
                extraField: "extraField",
            },
            cartItem: {
                quantity: 2,
                extraField: "extraField",
            },
        };

        const serializedCart = CartSerializer.parse(cart);

        expect(serializedCart).toEqual({
            variantID: "variantID",
            productID: "productID",
            price: 100,
            discountPrice: 90,
            image: "imageURL",
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
                quantity: 3,
            },
        };

        const serializedCart = CartSerializer.parse(cart);

        expect(serializedCart).toEqual({
            variantID: "variantID",
            productID: "productID",
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
                price: 100,
                discountPrice: 90,
                image: {
                    url: "imageURL1",
                },
                cartItem: {
                    quantity: 2,
                },
            },
            {
                variantID: "variantID2",
                productID: "productID2",
                price: 50,
                cartItem: {
                    quantity: 3,
                },
            },
        ];

        const serializedCarts = carts.map((cart) => CartSerializer.parse(cart));

        expect(serializedCarts).toEqual([
            {
                variantID: "variantID1",
                productID: "productID1",
                price: 100,
                discountPrice: 90,
                image: "imageURL1",
                quantity: 2,
                totalPrice: 180,
            },
            {
                variantID: "variantID2",
                productID: "productID2",
                price: 50,
                discountPrice: null,
                image: null,
                quantity: 3,
                totalPrice: 150,
            },
        ]);
    });
});
