const stringRegex = /^(\[(like|ne)\])?([\w-]+)$/;

const numberRegex = /^(?:\[(lte|gte|lt|gt|ne)\]\d+|\[between]\d+,\d+|\d+)$/;

const dateRegex = /^(\[(lte|gte|lt|gt|ne)\])?\d{4}-\d{2}-\d{2}$/;

const dateBetweenRegex = /^\[between\](\d{4}-\d{2}-\d{2}),(\d{4}-\d{2}-\d{2})$/;

const validateMinValue = (fieldName, minValue) => {
    return (value) => {
        if (value < minValue) {
            throw new Error(
                `${fieldName} should be greater than or equal to ${minValue}`
            );
        }
        return true;
    };
};

const validateNumber = (fieldName) => {
    return (value) => {
        if (typeof value !== "number") {
            throw new Error(`${fieldName} should be a number`);
        }
        return true;
    };
};

const validateInteger = (fieldName) => {
    return (value) => {
        if (!Number.isInteger(value)) {
            throw new Error(`${fieldName} should be an integer`);
        }

        return true;
    };
};

const validateQueryNumber = (fieldName) => {
    return (value) => {
        if (typeof value !== "string" && !Array.isArray(value)) {
            throw new Error(`${fieldName} should be a string or an array`);
        }

        if (typeof value === "string") {
            const isValid = numberRegex.test(value);
            if (!isValid) {
                throw new Error(`${fieldName} should have valid number format`);
            }
        }

        if (Array.isArray(value)) {
            value.forEach((element) => {
                const isValid = numberRegex.test(element);
                if (!isValid) {
                    throw new Error(
                        `${fieldName} array should contain valid number formats`
                    );
                }
            });
        }

        return true;
    };
};

const checkDateFormat = (value) => {
    let isValid = dateRegex.test(value);

    // Check for date between format
    if (!isValid) {
        isValid = dateBetweenRegex.test(value);
        // Check if the date is valid
        if (isValid) {
            const dates = value.split("]")[1].split(",");
            const date1 = new Date(dates[0]);
            const date2 = new Date(dates[1]);

            if (
                date1.toString() === "Invalid Date" ||
                date2.toString() === "Invalid Date"
            ) {
                isValid = false;
            }
        }
    } else {
        // Check if the date is valid if not in between format
        let date =
            value[0] === "[" ? new Date(value.split("]")[1]) : new Date(value);
        if (date.toString() === "Invalid Date") {
            isValid = false;
        }
    }

    return isValid;
};

const validateQueryDate = (fieldName) => {
    return (value) => {
        if (typeof value !== "string" && !Array.isArray(value)) {
            throw new Error(`${fieldName} should be a string or an array`);
        }

        if (typeof value === "string") {
            let isValid = checkDateFormat(value);

            if (!isValid) {
                throw new Error(
                    `${fieldName} should have valid date format ([operator]YYYY-MM-DD)`
                );
            }
        }

        if (Array.isArray(value)) {
            value.forEach((element) => {
                let isValid = checkDateFormat(element);

                if (!isValid) {
                    throw new Error(
                        `${fieldName} array should contain valid date formats ([operator]YYYY-MM-DD)`
                    );
                }
            });
        }

        return true;
    };
};

const validateQueryString = (fieldName) => {
    return (value) => {
        if (typeof value !== "string" && !Array.isArray(value)) {
            throw new Error(
                `${fieldName} should be a string or an array of string`
            );
        }

        if (typeof value === "string") {
            const isValid = stringRegex.test(value);
            if (!isValid) {
                throw new Error(`${fieldName} should have valid string format`);
            }
        }

        if (Array.isArray(value)) {
            value.forEach((element) => {
                const isValid = stringRegex.test(element);
                if (!isValid) {
                    throw new Error(
                        `${fieldName} array should contain valid string formats`
                    );
                }
            });
        }

        return true;
    };
};
const validateQueryInteger = (fieldName) => {
    return (value) => {
        if (value === undefined) {
            return true;
        }

        let num = parseInt(value, 10);
        if (isNaN(num) || num < 0) {
            throw new Error(`${fieldName} should be a positive integer`);
        }

        return true;
    };
};

const sanitizeSortingQuery = (value) => {
    if (typeof value === "string") {
        return value.split(",");
    }

    if (Array.isArray(value)) {
        return value
            .flat()
            .map((element) => element.split(","))
            .flat();
    }

    return [];
};

const validateSortingQuery = (allowedFields) => {
    return (value) => {
        value.forEach((element) => {
            const sortRegex = /^(-)?([\w-]+)$/;

            if (!sortRegex.test(element)) {
                throw new Error("Sort should be a valid format");
            }

            if (element.startsWith("-")) {
                element = element.slice(1);
            }

            if (!allowedFields.includes(element)) {
                throw new Error(`Invalid sort field: ${element}`);
            }
        });

        return true;
    };
};

const validateUnexpectedFields = (allowedFields) => {
    return (value) => {
        const fields = Object.keys(value);
        const unexpectedFields = fields.filter(
            (field) => !allowedFields.includes(field)
        );

        if (unexpectedFields.length > 0) {
            throw new Error(`Unexpected field: ${unexpectedFields.join(", ")}`);
        }

        return true;
    };
};

export {
    validateMinValue,
    validateNumber,
    validateInteger,
    validateQueryNumber,
    validateQueryInteger,
    validateQueryString,
    validateQueryDate,
    sanitizeSortingQuery,
    validateSortingQuery,
    validateUnexpectedFields,
    stringRegex,
    numberRegex,
};
