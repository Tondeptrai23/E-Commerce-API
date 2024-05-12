import { Op } from "sequelize";

import { Product } from "../models/ProductModel.js";
import { convertQueryToSequelizeCondition } from "../utils/utils.js";

class ProductController {
    static addOne = async (req, res) => {
        try {
            const productInfo = {
                name: req.body.name,
                description: req.body.description,
                imageURL: req.body.imageURL,
                price: req.body.price,
            };

            const newProduct = await Product.create(productInfo);
            res.status(201).json({
                success: true,
                product: newProduct,
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                success: false,
                error: "Error in creating product.",
            });
        }
    };

    static getProduct = async (req, res) => {
        try {
            const product = await Product.findByPk(req.params.id);

            if (product === null) {
                res.status(404).json({
                    success: false,
                    error: "Product not found.",
                });
            } else {
                res.status(200).json({
                    success: true,
                    product: product,
                });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({
                success: false,
                error: "Error in retrieving product.",
            });
        }
    };

    static getAllProducts = async (req, res) => {
        try {
            const conditions = convertQueryToSequelizeCondition(
                req.query,
                Product
            );

            const products = await Product.findAll({
                where: {
                    [Op.and]: conditions,
                },
            });

            res.status(200).json({
                success: true,
                products: products,
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                success: false,
                error: "Error in retrieving products.",
            });
        }
    };

    static updateProduct = async (req, res) => {
        try {
            const productInfo = {
                name: req.body.name,
                description: req.body.description,
                imageURL: req.body.imageURL,
                price: req.body.price,
            };

            const product = await Product.findByPk(req.params.id);
            if (product) {
                product.set(productInfo);
                await product.save();

                res.status(200).json({ success: true });
            } else {
                res.status(400).json({
                    success: false,
                    error: "Product not found",
                });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({
                success: false,
                error: "Error in updating product.",
            });
        }
    };

    static deleteProduct = async (req, res) => {
        try {
            const product = await Product.findByPk(req.params.id);

            if (product) {
                await product.destroy();

                res.status(200).json({ success: true });
            } else {
                res.status(400).json({
                    success: false,
                    error: "Product not found",
                });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({
                success: false,
                error: "Error in deleting product.",
            });
        }
    };
}

export { ProductController };
