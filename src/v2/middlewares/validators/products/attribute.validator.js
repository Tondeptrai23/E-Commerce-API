import { query } from "express-validator";
import { sanitizeSortingQuery } from "../utils.validator.js";

const validateQueryGetAttribute = [
    query("sort").customSanitizer(sanitizeSortingQuery),
];

export { validateQueryGetAttribute };
