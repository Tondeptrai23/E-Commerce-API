import { db } from "../models/index.js";
import { Product } from "../models/productModel.js";
import { UserService } from "../services/userService.js";
import { Order } from "../models/orderModel.js";
import { Cart } from "../models/cartModel.js";
import { OrderItem } from "../models/orderItemModel.js";

export default seedData = async () => {
    try {
        await db.sync({ force: true });

        for (let i = 0; i < 10; i++) {
            await Product.create(productData[i]);
        }

        await UserService.createNewAccount(userData[0]);

        await UserService.createNewAccount(userData[1]);

        await UserService.createNewAccount(userData[2]);

        await Order.create(orderData[0]);

        await Order.create(orderData[1]);

        await Order.create(orderData[2]);

        await OrderItem.create(orderItemData[0]);

        await OrderItem.create(orderItemData[1]);

        await OrderItem.create(orderItemData[2]);

        await OrderItem.create(orderItemData[3]);

        await OrderItem.create(orderItemData[4]);

        await Cart.create(cartData[0]);

        await Cart.create(cartData[1]);

        await Cart.create(cartData[2]);

        await Cart.create(cartData[3]);
    } catch (err) {
        console.log(err);
    }
};

export { productData, userData, orderData, orderItemData, cartData };

const productData = [
    {
        id: "1",
        name: "Apple",
        imageURL: "https://example.com/apple.jpg",
        price: 1000,
        description: "A fruit",
    },
    {
        id: "2",
        name: "Banana",
        imageURL: "https://example.com/banana.jpg",
        price: 2000,
        description: "Another fruit",
    },
    {
        id: "3",
        name: "Orange",
        imageURL: "https://example.com/orange.jpg",
        price: 1500,
        description: "Yet another fruit",
    },
    {
        id: "4",
        name: "Grapes",
        imageURL: "https://example.com/grapes.jpg",
        price: 1200,
        description: "A juicy fruit",
    },
    {
        id: "5",
        name: "Watermelon",
        imageURL: "https://example.com/watermelon.jpg",
        price: 2500,
        description: "A refreshing fruit",
    },
    {
        id: "6",
        name: "Mango",
        imageURL: "https://example.com/mango.jpg",
        price: 1800,
        description: "The king of fruits",
    },
    {
        id: "7",
        name: "Pineapple",
        imageURL: "https://example.com/pineapple.jpg",
        price: 2000,
        description: "A tropical fruit",
    },
    {
        id: "8",
        name: "Strawberry",
        imageURL: "https://example.com/strawberry.jpg",
        price: 1500,
        description: "A sweet and tangy fruit",
    },
    {
        id: "9",
        name: "Kiwi",
        imageURL: "https://example.com/kiwi.jpg",
        price: 1700,
        description: "A small but powerful fruit",
    },
    {
        id: "10",
        name: "Peach",
        imageURL: "https://example.com/peach.jpg",
        price: 1900,
        description: "A fuzzy fruit with a sweet taste",
    },
];

const userData = [
    {
        id: "1",
        name: "John Doe",
        email: "example@gmail.com",
        password: "password1",
        role: "ROLE_ADMIN",
    },
    {
        id: "2",
        name: "Jane Doe",
        email: "example2@gmail.com",
        password: "password2",
        role: "ROLE_USER",
    },
    {
        id: "3",
        name: "James Doe",
        email: "something@gmai.com",
        password: "password3",
        role: "ROLE_USER",
    },
];

const orderData = [
    {
        id: "1",
        userID: "1",
        payment: "COD",
        message: "Deliver to my house",
    },
    {
        id: "2",
        userID: "1",
        payment: "Paypal",
    },
    {
        id: "3",
        userID: "2",
        payment: "Visa",
    },
];

const orderItemData = [
    {
        orderID: "1",
        productID: "1",
        quantity: 2,
    },
    {
        orderID: "1",
        productID: "2",
        quantity: 36,
    },
    {
        orderID: "2",
        productID: "1",
        quantity: 12,
    },
    {
        orderID: "2",
        productID: "2",
        quantity: 3,
    },
    {
        orderID: "3",
        productID: "1",
        quantity: 1,
    },
];

const cartData = [
    {
        userID: "1",
        productID: "1",
        quantity: 2,
    },
    {
        userID: "1",
        productID: "3",
        quantity: 3,
    },
    {
        userID: "2",
        productID: "1",
        quantity: 1,
    },
    {
        userID: "2",
        productID: "2",
        quantity: 2,
    },
];
