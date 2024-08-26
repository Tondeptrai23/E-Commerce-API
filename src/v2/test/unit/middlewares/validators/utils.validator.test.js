import * as utilsValidator from "../../../../middlewares/validators/utils.validator.js";

describe("validateMinValue", () => {
    const validateMinValue = utilsValidator.validateMinValue("fieldName", 5);
    test("should return true if value is greater than or equal to minValue", () => {
        const result = validateMinValue(5);
        expect(result).toBe(true);
    });

    test("should throw an error if value is less than minValue", () => {
        expect(() => validateMinValue(4)).toThrowError(
            "fieldName should be greater than or equal to 5"
        );
    });
});

describe("validateNumber", () => {
    const validateNumber = utilsValidator.validateNumber("fieldName");
    test("should return true if value is a number", () => {
        const result = validateNumber(5);
        expect(result).toBe(true);
    });

    test("should throw an error if value is not a number", () => {
        expect(() => validateNumber("5")).toThrowError(
            "fieldName should be a number"
        );
    });
});

describe("validateInteger", () => {
    const validateInteger = utilsValidator.validateInteger("fieldName");
    test("should return true if value is an integer", () => {
        const result = validateInteger(5);
        expect(result).toBe(true);
    });

    test("should throw an error if value is not an integer", () => {
        expect(() => validateInteger(5.5)).toThrowError(
            "fieldName should be an integer"
        );
    });

    test("should throw an error if value is not an integer 2", () => {
        expect(() => validateInteger("5")).toThrowError(
            "fieldName should be an integer"
        );
    });
});

describe("validateQueryNumber", () => {
    const validateQueryNumber = utilsValidator.validateQueryNumber("fieldName");

    test("should return true if value is a string with valid number format", () => {
        const result = validateQueryNumber("5");
        expect(result).toBe(true);
    });

    test("should return true if value is an array with valid number format", () => {
        const result = validateQueryNumber(["5", "[gte]5", "[lt]5"]);
        expect(result).toBe(true);
    });

    test("should throw an error if value is not a string or an array", () => {
        expect(() => validateQueryNumber(5)).toThrowError(
            "fieldName should be a string or an array"
        );
    });

    test("should throw an error if value is not a string or an array 2", () => {
        expect(() => validateQueryNumber({})).toThrowError(
            "fieldName should be a string or an array"
        );
    });

    test("should throw an error if value does not have valid number format", () => {
        expect(() => validateQueryNumber("5a")).toThrowError(
            "fieldName should have valid number format"
        );
    });

    test("should throw an error if value does not have valid number format 2", () => {
        expect(() => validateQueryNumber(["5", "5a"])).toThrowError(
            "fieldName array should contain valid number formats"
        );
    });

    test("should throw an error if value does not have valid number format 3", () => {
        expect(() =>
            validateQueryNumber(["5", "[invalid]5", "5a"])
        ).toThrowError("fieldName array should contain valid number formats");
    });
});

describe("validateQueryDate", () => {
    const validateQueryDate = utilsValidator.validateQueryDate("fieldName");

    test("should return true if value is a string with valid date format", () => {
        const result = validateQueryDate("2024-01-01");
        expect(result).toBe(true);
    });

    test("should return true if value is an array with valid date format", () => {
        const result = validateQueryDate([
            "[ne]2024-01-01",
            "[gte]2024-01-02",
            "[between]2024-01-01,2024-01-02",
        ]);
        expect(result).toBe(true);
    });

    test("should throw an error if value is not a string or an array", () => {
        expect(() => validateQueryDate({})).toThrowError(
            "fieldName should be a string or an array"
        );
    });

    test("should throw an error if value does not have valid date format", () => {
        expect(() => validateQueryDate("2024-01-32")).toThrowError(
            "fieldName should have valid date format"
        );
    });

    test("should throw an error if value does not have valid date format 2", () => {
        expect(() => validateQueryDate("01-01-2024")).toThrowError(
            "fieldName should have valid date format"
        );
    });

    test("should throw an error if value does not have valid date format 3", () => {
        expect(() => validateQueryDate("[gte]2024-01-32")).toThrowError(
            "fieldName should have valid date format"
        );
    });

    test("should throw an error if value does not have valid date format 4", () => {
        expect(() => validateQueryDate("[in]2024-01-01")).toThrowError(
            "fieldName should have valid date format"
        );
    });

    test("should throw an error if value does not have valid date format 5", () => {
        expect(() =>
            validateQueryDate(["2024-01-01", "2024-01-32"])
        ).toThrowError("fieldName array should contain valid date formats");
    });
});

describe("validateQueryString", () => {
    const validateQueryString = utilsValidator.validateQueryString("fieldName");

    test("should return true if value is a string", () => {
        const result = validateQueryString("value");
        expect(result).toBe(true);
    });

    test("should return true if value is an array", () => {
        const result = validateQueryString(["[ne]value", "[like]value2"]);
        expect(result).toBe(true);
    });

    test("should throw an error if value is not a string or an array", () => {
        expect(() => validateQueryString(5)).toThrowError(
            "fieldName should be a string"
        );
    });

    test("should throw an error if value is not a string or an array 2", () => {
        expect(() => validateQueryString({})).toThrowError(
            "fieldName should be a string"
        );
    });

    test("should throw an error if value is an empty string", () => {
        expect(() => validateQueryString("")).toThrowError(
            "fieldName should have valid string format"
        );
    });

    test("should throw an error if value is an empty string 2", () => {
        expect(() => validateQueryString(["value", ""])).toThrowError(
            "fieldName array should contain valid string formats"
        );
    });

    test("should throw an error if value does not have valid string format", () => {
        expect(() => validateQueryString("value!")).toThrowError(
            "fieldName should have valid string format"
        );
    });

    test("should throw an error if value does not have valid string format 2", () => {
        expect(() =>
            validateQueryString(["value", "[keli]value"])
        ).toThrowError("fieldName array should contain valid string formats");
    });
});

describe("validateQueryInteger", () => {
    const validateQueryInteger =
        utilsValidator.validateQueryInteger("fieldName");

    test("should return true if value is a string with valid integer format", () => {
        const result = validateQueryInteger("5");
        expect(result).toBe(true);
    });

    test("should throw an error if value is not parsable to an integer", () => {
        expect(() => validateQueryInteger({})).toThrowError(
            "fieldName should be a positive integer"
        );
    });

    test("should throw an error if value is empty", () => {
        expect(() => validateQueryInteger("")).toThrowError(
            "fieldName should be a positive integer"
        );
    });

    test("should throw an error if value is less than 0", () => {
        expect(() => validateQueryInteger("-5")).toThrowError(
            "fieldName should be a positive integer"
        );
    });
});

describe("sanitizeSortingQuery", () => {
    test("should return an array of strings if value is a string", () => {
        const result = utilsValidator.sanitizeSortingQuery("attributeID");
        expect(result).toEqual(["attributeID"]);
    });

    test("should return an array of strings if value is an array", () => {
        const result = utilsValidator.sanitizeSortingQuery([
            "attributeID",
            "name",
        ]);
        expect(result).toEqual(["attributeID", "name"]);
    });

    test("should flatten the array if value is a nested array", () => {
        const result = utilsValidator.sanitizeSortingQuery([
            "attributeID,value",
            ["name", "updatedAt,createdAt"],
        ]);
        expect(result).toEqual([
            "attributeID",
            "value",
            "name",
            "updatedAt",
            "createdAt",
        ]);
    });
});

describe("validateSortingQuery", () => {
    const validateSortingQuery = utilsValidator.validateSortingQuery([
        "attributeID",
        "name",
    ]);

    test("should return true if value is an array of allowed fields", () => {
        const result = validateSortingQuery(["attributeID", "name"]);
        expect(result).toBe(true);
    });

    test("should throw an error if value is not an array of allowed fields", () => {
        expect(() =>
            validateSortingQuery(["attributeID", "invalid"])
        ).toThrowError("Invalid sort field: invalid");
    });
});

describe("validateUnexpectedFields", () => {
    const validateUnexpectedFields = utilsValidator.validateUnexpectedFields([
        "attributeID",
        "name",
    ]);

    test("should return true if value is an array of allowed fields", () => {
        const result = validateUnexpectedFields({
            attributeID: "value",
            name: "value",
        });
        expect(result).toBe(true);
    });

    test("should throw an error if value is not an array of allowed fields", () => {
        expect(() =>
            validateUnexpectedFields({
                attributeID: "value",
                invalid: "value",
            })
        ).toThrowError("Unexpected field: invalid");
    });
});
