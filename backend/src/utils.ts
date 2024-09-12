import assert from "assert"
import { Request, Response } from "express"

interface DataInterface {
    [key: string]: any
}

function routeLog(req: { path: any }, msg: string) {
    console.log(`[${req.path}]`, msg)
}

function validateData(req: Request, res: Response, data: DataInterface, schema: DataInterface) {
    try {
        const schemaKeys = Object.keys(schema)
        const dataKeys = Object.keys(data)

        // Check if all keys are present
        for (const schemaKey of schemaKeys) {
            assert(dataKeys.includes(schemaKey), `Missing key: ${schemaKey}`)
        }

        // Check if there are any extra keys
        for (const dataKey of dataKeys) {
            assert(schemaKeys.includes(dataKey), `Invalid key: ${dataKey}`)
        }

        // Check if types match
        for (const key of schemaKeys) {
            assert(typeof data[key] === typeof schema[key], `Type Mismatch: ${key}`)

            // Recursively validate nested objects
            if (typeof schema[key] === 'object' && !Array.isArray(schema[key])) {
                if (!validateData(req, res, data[key], schema[key])) {
                    return false
                }
            }

            // Recursively validate arrays
            if (Array.isArray(schema[key])) {
                // Iterate over each element in the array
                for (const element of data[key]) {
                    // Schema arrays should always have a single element to validate against
                    if (!validateData(req, res, element, schema[key][0])) { 
                        return false
                    }
                }
            }
        }
    } catch (error: any) {
        routeLog(req, error.message)
        res.status(400).send(error.message)
        return false
    }

    return true
}

module.exports = {
    routeLog,
    validateData
}