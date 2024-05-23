import { sequelize } from "../config/databaseConfig.js";
import { User } from "./userModel.js";
import { Product } from "./productModel.js";
import { Cart } from "./cartModel.js";
import { Order } from "./orderModel.js";
import { OrderItem } from "./orderItemModel.js";

// User - (1, n) - Order
User.hasMany(Order);
Order.belongsTo(User, {
    onDelete: "CASCADE",
    as: "user",
});

// Order - (n, n) - Product;
Order.belongsToMany(Product, {
    through: OrderItem,
    as: "products",
    foreignKey: "orderID",
    constraints: true,
    onDelete: "CASCADE",
});
Product.belongsToMany(Order, {
    through: OrderItem,
    as: "orders",
    foreignKey: "productID",
    constraints: true,
    onDelete: "CASCADE",
});

// User - (1, 1) - Cart - (n, n) - Product
User.belongsToMany(Product, {
    through: Cart,
    as: "products",
    foreignKey: "userID",
    otherKey: "productID",
    constraints: true,
    onDelete: "CASCADE",
});
Product.belongsToMany(User, {
    through: Cart,
    as: "users",
    foreignKey: "productID",
    constraints: true,
    onDelete: "CASCADE",
});

export { sequelize as db };
