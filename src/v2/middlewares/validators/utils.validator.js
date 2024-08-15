const stringRegex = /^(\[like\])?([\w-]+)$/;

const numberRegex = /^(?:\[(lte|gte)\]\d+|\[between]\d+,\d+|\d+)$/;

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

const validateQueryInteger = (fieldName) => {
    return (value) => {
        if (value === undefined) {
            return true;
        }

        if (isNaN(parseInt(value, 10))) {
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
            throw new Error(
                `Unexpected fields: ${unexpectedFields.join(", ")}`
            );
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
    sanitizeSortingQuery,
    validateSortingQuery,
    validateUnexpectedFields,
    stringRegex,
    numberRegex,
};
