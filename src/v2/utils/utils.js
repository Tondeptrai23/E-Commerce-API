import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

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
 * @returns {Array} the flattened array
 */
const flattenArray = (array) => {
    return [...new Set(array.flat())];
};

/**
 * Convert to an array
 *
 * @param {any} value the value to be converted
 * @returns {Array} the value as an array
 */
const toArray = (value) => {
    if (value === null || value === undefined) {
        return [];
    }
    return Array.isArray(value) ? value : [value];
};

const getExtensionByContentType = (contentType) => {
    const contentTypeMap = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/gif": "gif",
        "image/bmp": "bmp",
    };
    return contentTypeMap[contentType] ?? "txt";
};

export {
    isEmptyObject,
    appendToObject,
    removeEmptyFields,
    flattenArray,
    toArray,
    getExtensionByContentType,
};
