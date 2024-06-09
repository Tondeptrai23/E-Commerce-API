import { isEmptyObject, appendToObject } from "../../utils/utils.js";

describe("isEmptyObject", () => {
    test("returns true if object is empty", () => {
        expect(isEmptyObject({})).toBe(true);
    });

    test("returns false if object is not empty", () => {
        expect(isEmptyObject({ name: "Something" }));
    });

    test("returns false if object is not empty", () => {
        expect(isEmptyObject({ name: "Something", price: 1000 }));
    });
});

describe("appendToObject", () => {
    test("returns newObject if obj is null", () => {
        const obj = null;
        const newObject = { name: "Something" };
        const result = appendToObject(obj, newObject);
        expect(result).toEqual(newObject);
    });

    test("returns newObject if obj is null", () => {
        const obj = null;
        const newObject = { name: "Something", price: 1000 };
        const result = appendToObject(obj, newObject);
        expect(result).toEqual(newObject);
    });

    test("returns obj with newObject appended", () => {
        const obj = { name: "Something" };
        const newObject = { price: 1000 };
        const result = appendToObject(obj, newObject);
        expect(result).toEqual({ name: "Something", price: 1000 });
    });
});
