function formatQuantityInProduct(product) {
    const {
        cart = {},
        orderProduct = {},
        ...formattedProduct
    } = JSON.parse(JSON.stringify(product));

    if (Object.keys(cart).length !== 0) {
        formattedProduct.quantity = cart.quantity;
    } else if (Object.keys(orderProduct).length !== 0) {
        formattedProduct.quantity = orderProduct.quantity;
    }

    return formattedProduct;
}

class ProductAPIResponseSerializer {
    static serialize = (product) => {
        const productObj = JSON.parse(JSON.stringify(product));

        const { updatedAt, createdAt, ...newProduct } = productObj;

        return formatQuantityInProduct(newProduct);
    };
}

class OrderAPIResponseSerializer {
    static serialize = (order) => {
        const orderObj = JSON.parse(JSON.stringify(order));

        const { updatedAt, createdAt, userId, ...newOrder } = orderObj;

        if (newOrder.products) {
            newOrder.products = newOrder.products.map((product) => {
                return formatQuantityInProduct(product);
            });
        }

        return newOrder;
    };
}

export { OrderAPIResponseSerializer, ProductAPIResponseSerializer };
