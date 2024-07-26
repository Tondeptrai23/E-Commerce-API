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
                throw new Error(`${fieldName} should has valid number format`);
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

export {
    validateMinValue,
    validateNumber,
    validateInteger,
    validateQueryNumber,
    stringRegex,
    numberRegex,
};
