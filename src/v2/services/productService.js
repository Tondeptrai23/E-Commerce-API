import { Op } from "sequelize";

import { Product } from "../models/productModel.js";
import SequelizeQueryBuilder from "./sequelizeQueryBuilder.js";

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
        const queryBuilder = new SequelizeQueryBuilder();

        const filterConditions = queryBuilder.convertFilterCondition(query);
        const sortConditions = queryBuilder.convertSortCondition(query);
        const { limit, offset } =
            queryBuilder.convertPaginationCondition(query);

        const { rows, count, ...rest } = await Product.findAndCountAll({
            where: {
                [Op.and]: filterConditions,
            },
            attributes: {
                exclude: ["updatedAt", "createdAt"],
            },
            order: sortConditions,
            limit: limit,
            offset: offset,
        });

        const products = rows;
        const quantity = count;
        const totalPages = Math.ceil(quantity / limit);
        const currentPage = query.page === undefined ? 1 : query.page;
        return { products, quantity, totalPages, currentPage };
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
