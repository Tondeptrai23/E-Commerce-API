const isEmptyObject = (obj) => {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
};

const removeEmptyFields = (obj) => {
    return Object.fromEntries(
        Object.entries(obj).filter(
            ([field, value]) =>
                value != null && value != [] && value != "" && value != {}
        )
    );
};

const appendToObject = (obj, newObject) => {
    if (!obj) {
        obj = newObject;
    } else {
        Object.assign(obj, newObject);
    }
    return obj;
};

/**
 * Flatten 2D array to 1D array and remove duplicates
 *
 * @param {Array} array the 2D array to be flattened
 */
const flattenArray = (array) => {
    return [...new Set(array.flat())];
};

export { isEmptyObject, appendToObject, removeEmptyFields, flattenArray };
