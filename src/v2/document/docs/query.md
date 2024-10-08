# Query Parameters:

## Pagination:

-   `page` (int): The page number to retrieve. Default is 1.
-   `size` (int): The number of items to retrieve per page. Default is 5.

Example:

-   `?page=2&size=10`: Retrieve the second page with 10 items per page.

## Sorting:

Sort results based on one or more fields. Sorting order is specified by `-` prefix for descending.

Support both string or array of strings.

By default, all routes are sorted by `createdAt` in descending order.

Example:

-   `?sort=name`: Sort by name ascending.
-   `?sort=name,-price`: Sort by name ascending and price descending.
-   `?sort=-name&sort=price`: Sort by name descending and price ascending.

### **Specific Routes**

These query parameters can be applied to any route. However, some routes have additional parameters (sort by associated models), which are detailed below.

#### _GET /products and GET /admin/products_

-   Sort by Variants Properties: `?sort=price`

    -   Sort products based on variant properties (only supports `price`, `discountPrice`, `stock`). This will sort products by the price of their first variant.

## Filtering

### **String Filtering**

Used to filter results based on string fields. The filter can be applied to a single field or multiple fields.

Supports both exact matches and partial matches (using `[like]` as a prefix), and is case-insensitive.

Supports `[ne]` for not equal.

Accepts either a single string or an array of strings.

The Regex for this filter is `/^(\[(like|ne)\])?(([\w-@.]|\s)+)$/`.

Example:

-   `?name=T-shirt`: Filter results where the name exactly equals to `T-shirt`.

-   `?name[like]shirt`: Filter results where the name contains `shirt`. E.g. `T-shirt`, `Shirt`, `shirt`.

-   `?name=[like]shirt&name=[like]sleeve`: Filter results where the name contains both `shirt` and `sleeve`. E.g. `Short sleeve shirt`, `Long sleeve shirt`.

-   `?name[ne]=T-shirt`: Filter results where the name is not equal to `T-shirt`.

### **Number Filtering**

Used to filter results based on integer or float fields. The filter can be applied to a single field or multiple fields.

Supports operators: `[ne]`, `[gt]`, `[gte]`, `[lt]`, `[lte]`, and `[between]`.

Accepts either a single value or an array of values.

The Regex for this filter is `/^(?:\[(lte|gte|lt|gt|ne)\]\d+|\[between]\d+,\d+|\d+)$/`.

Examples:

-   `?price=100`: Filters results where the price is exactly `100`.

-   `?price[gt]=100`: Filters results where the price is greater than `100`.

-   `?price[gte]=100`: Filters results where the price is greater than or equal to `100`.

-   `?price[lt]=100&price[gt]=50`: Filters results where the price is less than `100` and greater than `50`.

-   `?price[between]=50,100`: Filters results where the price is between `50` and `100`.

### **Date Filtering**

Used to filter results based on date fields. The filter can be applied to a single field or multiple fields.

Supports operators: `[ne]`, `[gt]`, `[gte]`, `[lt]`, `[lte]`, and `[between]`.

Accepts either a single date or an array of dates.

The Regex for this filter is `/^(?:\[(lte|gte|lt|gt|ne)\]\d{4}-\d{2}-\d{2}|\[between]\d{4}-\d{2}-\d{2},\d{4}-\d{2}-\d{2}|\d{4}-\d{2}-\d{2})$/`.

Example:

-   `?createdAt=2024-01-01`: Filters results where the creation date is exactly `2024-01-01`.

-   `?createdAt=[gt]2024-01-01`: Filters results where the creation date is after `2024-01-01`.

-   `?createdAt=[gte]2024-01-01`: Filters results where the creation date is on or after `2024-01-01`.

-   `?createdAt=[lt]2024-01-01&createdAt=[gt]2023-01-01`: Filters results where the creation date is before `2024-01-01` and after `2023-01-01`.

-   `?createdAt=[between]2023-01-01,2024-01-01`: Filters results where the creation date is between `2023-01-01` and `2024-01-01`.

### **Combining Filters**

Support filter by multiple fields.

Support both string or array of strings.

Examples:

-   `?name=T-shirt&price[lt]=100`: Filters results where the name is `T-shirt` and the price is less than `100`.

-   `?name[like]=T-shirt&price[lt]=100&createdAt[gte]=2023-01-01`: Filters results where the name contains `T-shirt`, the price is less than `100`, and the creation date is on or after `2023-01-01`.

### **Note**

Using multiple conditions for the same field, such as `price=100&price=200`, is equivalent to applying an OR condition (price equals `100` or `200`).

However, using operators with the same field, such as `price=100&price[gt]=200`, applies an AND condition (price equals `100` and is greater than `200`).

The same logic applies to string and date queries.

### **Specific Routes**

These query parameters can be applied to any route. However, some routes have additional parameters, which are detailed below.

#### _GET /admin/variants_

-   Filter by Attributes: `?attributes[color]=red&attributes[size]=M&attributes[size]=L`

    -   Filters variants based on their variants' attributes. This will return variants with at least one variant that matches the `color` red and the `size` M or L. An OR condition applies to the same attribute (e.g., `M` or `L`), while an AND condition applies across different attributes (e.g., `color` and `size`).

    -   This feature is suitable for filtering variants based on multiple attributes values. If you want to filter variants based on a single attribute ("color" or "size"), or a single attribute value ("red" or "M"), you should use the `GET /admin/attributes/:attributeID/variants` or `GET /admin/attributes/:attributeID/values/:valueID/variants` routes (also support filtering, pagination, sorting by variants' fields).

#### _GET /products and GET /admin/products_

-   Filter by Category: `?category=tops`

    -   Filters products by the category name. All products within the `tops` category, including those in its subcategories, will be returned.
        For instance, a product in the `tshirt` category will be included since `tshirt` is a subcategory of `tops`.

-   Filter by Multiple Categories: `?category=tshirt&category=unisex`

    -   Filters products by multiple categories. Only products that belong to both the `tshirt` and `unisex` categories will be returned (AND condition).

-   Filter by Variant Properties: `?variants[price]=[lte]100`

    -   Filters products based on variant properties like `price` or `stock`. This will return products with at least one variant priced at or below `100`.

-   Filter by Variant Attributes: `?attributes[color]=red&attributes[size]=M&attributes[size]=L`

    -   The same as `Filter by Attributes` in the [GET /admin/variants](#get-adminvariants) section. But this will return products instead of variants.

#### _GET /admin/coupons_

-   Filter by Supported Products: `?product[name]=[like]T-shirt`

    -   Filters coupons based on some properties of the supported products (`name`, `productID`, or `createdAt`). For example, this query will return all coupons that support products with `t-shirt` in their name.

-   Filter by Supported Categories: `?categories=tops`

    -   Filters coupons based on the name of the supported categories. This will return all coupons that apply to products in the `tops` category, including products in subcategories.

#### _GET /admin/attributes_

-   Filter by Values: `?values=[like]L`

    -   Filters attributes based on the values. This will return all attributes with any values containing `L` or `l`.

-   Filter by Values using `ne`: `?values[ne]=L`

    -   This will not work as expected. You'll get attributes that have any values other than L, even if they also have the value L. This is because the filter checks each value individually, not the entire attribute.

#### _GET /admin/orders_

-   Filter by Variants: `?variants[price]=[lte]100`

    -   Filters orders based on the properties of the variants in the order. This will return orders with at least one variant priced at or below `100`.

-   Filter by Variants using `ne`: `?variants[price]=[ne]100`

    -   This will not work as expected. You'll get orders that have any variants with a price other than 100, even if they also have a variant with a price of 100. This is because the filter checks each variant individually, not the entire order.

-   Filter by Shipping Address: `?shippingAddress[city]=Ha Noi`

    -   Filters orders based on the shipping address. This will return orders with the shipping address in Ha Noi.
