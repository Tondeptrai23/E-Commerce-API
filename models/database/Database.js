import { sequelize } from "./Config.js";
import { User } from "../UserModel.js";
import { Product } from "../ProductModel.js";
import { Cart } from "../CartModel.js";
import { Order } from "../OrderModel.js";
import { OrderItem } from "../OrderItemModel.js";

// User - (1, n) - Order
User.hasMany(Order);
Order.belongsTo(User);

// Order - (n, n) - Product
Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

// User - (1, 1) - Cart - (n, n) - Product
User.belongsToMany(Product, { through: Cart });
Product.belongsToMany(User, { through: Cart });

export { sequelize as db };
