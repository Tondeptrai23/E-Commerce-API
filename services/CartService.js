import { ProductService } from "./ProductService.js";

class CartService {
    static #getProductByID = async (user, productID) => {
        const result = await user.getProduct({
            where: { id: productID },
        });
        return result[0];
    };

    static addProduct = async (user, productID) => {
        let isNewProduct = false;

        if (!(await user.hasProduct(productID))) {
            const product = await ProductService.findOneByID(productID);
            await user.addProduct(product);
            isNewProduct = true;
        }

        const productWithCart = await this.#getProductByID(user, productID);

        if (!isNewProduct) {
            productWithCart.cart.quantity += 1;
            await productWithCart.cart.save();
        }

        return productWithCart;
    };

    static getProducts = async (user) => {
        const products = await user.getProduct();
        return products;
    };

    static fetchCartToOrder = async (user) => {
        //
    };

    static deleteProduct = async (user, productID) => {
        const result = await user.removeProduct(productID);
        return result;
    };

    static setQuantity = async (user, productID, newQuantity) => {
        const product = await this.#getProductByID(user, productID);

        product.cart.quantity = newQuantity;
        await product.cart.save();
        return product;
    };

    static deleteAllProducts = async (user) => {
        await user.setProduct([]);
    };
}

export { CartService };
