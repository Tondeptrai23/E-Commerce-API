import { Op } from "sequelize";

import { Product } from "../models/ProductModel.js";
import { convertQueryToSequelizeCondition } from "../utils/utils.js";

class ProductService {
    static createOne = async (productInfo) => {
        const newProduct = await Product.create(productInfo);
        return newProduct;
    };

    static findOneByID = async (productID) => {
        const product = await Product.findByPk(productID, {
            attributes: {
                exclude: ["updatedAt", "createdAt"],
            },
        });
        return product;
    };

    static findAllProducts = async (query) => {
        const conditions = convertQueryToSequelizeCondition(query, Product);

        const { rows, count } = await Product.findAndCountAll({
            where: {
                [Op.and]: conditions,
            },
            attributes: {
                exclude: ["updatedAt", "createdAt"],
            },
        });

        const products = rows;
        const quantity = count;
        return { products, quantity };
    };

    static updateOneByID = async (productID, newProductInfo) => {
        const product = await this.findOneByID(productID);

        if (product) {
            product.set(newProductInfo);
            await product.save();
        }

        return product;
    };

    static deleteOneByID = async (productID) => {
        const product = await this.findOneByID(productID);

        if (product) {
            await product.destroy();
        }
        return product;
    };
}
export { ProductService };
