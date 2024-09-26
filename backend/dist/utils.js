"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeLog = routeLog;
exports.validateData = validateData;
const assert_1 = __importDefault(require("assert"));
function routeLog(req, msg) {
    console.log(`[${req.path}]`, msg);
}
/**
 * Data and Schema passed should be an object.
 * @param req
 * @param res
 * @param data
 * @param schema
 * @returns
 */
function validateData(req, res, data, schema) {
    try {
        const schemaKeys = Object.keys(schema);
        const dataKeys = Object.keys(data);
        // Check if all keys are present
        for (const schemaKey of schemaKeys) {
            (0, assert_1.default)(dataKeys.includes(schemaKey), `Missing key: ${schemaKey}`);
        }
        // Check if there are any extra keys
        for (const dataKey of dataKeys) {
            (0, assert_1.default)(schemaKeys.includes(dataKey), `Invalid key: ${dataKey}`);
        }
        // Check if types match
        for (const key of schemaKeys) {
            // Check if types match
            (0, assert_1.default)(typeof data[key] === typeof schema[key], `Type Mismatch: ${key}`);
            // Recursively validate nested objects
            if (typeof schema[key] === 'object' && !Array.isArray(schema[key])) {
                if (!validateData(req, res, data[key], schema[key])) {
                    return false;
                }
            }
            // Recursively validate arrays
            if (Array.isArray(schema[key])) {
                // Iterate over each element in the array
                for (const element of data[key]) {
                    // Schema arrays should always have a single element to validate against
                    // if elements are not objects
                    (0, assert_1.default)(typeof data[key] === typeof schema[key], `Type Mismatch: ${key}`);
                    // recursively validate the element if object
                    if (typeof schema[key] === 'object' && !Array.isArray(schema[key])) {
                        if (!validateData(req, res, element, schema[key][0])) {
                            return false;
                        }
                    }
                }
            }
        }
    }
    catch (error) {
        routeLog(req, error.message);
        res.status(400).send(error.message);
        return false;
    }
    return true;
}
