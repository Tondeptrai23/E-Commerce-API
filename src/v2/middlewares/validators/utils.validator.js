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

export { validateMinValue, validateNumber, validateInteger };
