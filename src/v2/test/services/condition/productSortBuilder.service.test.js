import ProductSortBuilder from "../../../services/condition/productSortBuilder.service.js";

describe("ProductSortBuilder", () => {
    describe("build", () => {
        test("should return an array with default sorting if the query is empty", () => {
            const query = {};
            const sortBuilder = new ProductSortBuilder(query);
            const result = sortBuilder.build();
            expect(result).toEqual(["`product`.`createdAt` DESC"]);
        });

        test("should return an array with default sorting if the sort field is not array", () => {
            const query = { sort: "price" };
            const sortBuilder = new ProductSortBuilder(query);
            const result = sortBuilder.build();
            expect(result).toEqual(["`product`.`createdAt` DESC"]);
        });

        test("should return an array of order conditions compatible for Sequelize sorting", () => {
            const query = { sort: ["price"] };
            const sortBuilder = new ProductSortBuilder(query);
            const result = sortBuilder.build();
            expect(result).toEqual(
                ["`variant`.`price` ASC"],
                ["`product`.`createdAt` DESC"]
            );
        });

        test("should return an array of order conditions compatible for Sequelize sorting with multiple fields and directions", () => {
            const query = { sort: ["-price", "name"] };
            const sortBuilder = new ProductSortBuilder(query);
            const result = sortBuilder.build();
            expect(result).toEqual([
                "`variant`.`price` DESC",
                "`product`.`name` ASC",
                "`product`.`createdAt` DESC",
            ]);
        });

        test("should return an array of order conditions compatible for Sequelize sorting with multiple fields and directions", () => {
            const query = { sort: ["-price", "-name", "createdAt", "-stock"] };
            const sortBuilder = new ProductSortBuilder(query);
            const result = sortBuilder.build();
            expect(result).toEqual([
                "`variant`.`price` DESC",
                "`product`.`name` DESC",
                "`product`.`createdAt` ASC",
                "`variant`.`stock` DESC",
                "`product`.`createdAt` DESC",
            ]);
        });
    });
});
