import { db } from "../models/index.js";
import { Product } from "../models/productModel.js";
import { UserService } from "../services/userService.js";
import { Order } from "../models/orderModel.js";
import { Cart } from "../models/cartModel.js";
import { OrderItem } from "../models/orderItemModel.js";

export default seedData = async () => {
    try {
        await db.sync({ force: true });

        await Product.create(productData[0]);

        await Product.create(productData[1]);

        await Product.create(productData[2]);

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
        price: 1000,
        description: "A fruit",
    },
    {
        id: "2",
        name: "Banana",
        price: 2000,
        description: "Another fruit",
    },
    {
        id: "3",
        name: "Orange",
        price: 1500,
        description: "Yet another fruit",
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
