const validatePositiveNumber = (fieldName) => {
    return (value) => {
        if (value < 0) {
            throw new Error(
                `${fieldName} should be greater than or equal to 0`
            );
        }
        return true;
    };
};

export { validatePositiveNumber };
