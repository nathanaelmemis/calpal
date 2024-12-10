interface DataInterface {
    [key: string]: any
}

function assert(condition: boolean, message: string) {
    if (!condition) {
        throw new Error(message)
    }
}

/**
 * Data and Schema passed should be an object. 
 * @param data 
 * @param schema 
 * @returns 
 */
export function validateData(data: DataInterface, schema: DataInterface) {

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
            // Check if types match
            assert(typeof data[key] === typeof schema[key], `Type Mismatch: ${key}`)

            // Recursively validate nested objects
            if (typeof schema[key] === 'object' && !Array.isArray(schema[key])) {
                if (!validateData(data[key], schema[key])) {
                    return false
                }
            }

            // Recursively validate arrays
            if (Array.isArray(schema[key])) {
                // Iterate over each element in the array
                for (const element of data[key]) {
                    // Schema arrays should always have a single element to validate against

                    // if elements are not objects
                    assert(typeof data[key] === typeof schema[key], `Type Mismatch: ${key}`)
                    
                    // recursively validate the element if object
                    if (typeof schema[key] === 'object' && !Array.isArray(schema[key])) {
                        if (!validateData(element, schema[key][0])) { 
                            return false
                        }
                    }
                }
            }
        }
    } catch (error: any) {
        console.error(error.message)
        return false
    }

    return true
}