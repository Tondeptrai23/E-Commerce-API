const isEmptyObject = (obj) => {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
};

const removeEmptyFields = (obj) => {
    return Object.fromEntries(
        Object.entries(obj).filter(([field, value]) => value != null)
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

export { isEmptyObject, appendToObject, removeEmptyFields };
