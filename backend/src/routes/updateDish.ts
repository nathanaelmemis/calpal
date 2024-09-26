import { ObjectId } from "mongodb";
import { client } from "../database"
const utils = require("../utils.ts")
const assert = require('assert');

import {Request, Response} from 'express'
import { DishFood } from "../interfaces/dishFood";

export async function updateDish(req: Request, res: Response) {
    try {
        await client.connect()

        // // FIXME: DISABLED
        // res.sendStatus(501)
        // return

        const data = req.body
        const userID = data.userID
        const dishID = data.dishID
        
        // Data Validation  
        const schema = {
            dishID: "",
            userID: "",
            name: "",
            defaultServing: 0,
            foods: [0] // only accepts array of defaultServing because user shouldn't be able to update foodID
        }
        if (!utils.validateData(req, res, data, schema)) {
            return
        }

        utils.routeLog(req, `Updating Dish: ${userID} ${dishID}`)

        // Retrieve food & dish data
        const duplicateFood = await client.db("CalPal").collection("foods").find({ userID: userID, name: data.name}).toArray()
        const duplicateDish = await client.db("CalPal").collection("dish").find({ userID: userID, name: data.name}).toArray()

        // Check if dish in foods or dish already exists
        if (duplicateFood.length > 0 || duplicateDish.length > 0) {
            utils.routeLog(req, "Dish already exists.")
            res.status(400).send("Dish already exists.")
            return
        }

        // Remove data that doesn't need to be updated
        delete data.dishID
        delete data.userID
        Object.keys(data).forEach((key: string) => {
            // Remove empty strings and -1 values
            if (typeof data[key] === "string") {
                if (data[key].length === 0) {
                    delete data[key]
                }
            } else if (typeof data[key] === "number") {
                if (data[key] === -1) {
                    delete data[key]
                }
            }
        })

        // Divide data to designated update
        const nonDishFoodData: {name?: string, defaultServing?: number} = {}
        data.name? nonDishFoodData.name = data.name : null
        data.defaultServing? nonDishFoodData.defaultServing = data.defaultServing : null

        // Create bulk write operations
        const bulkWriteOperations = []
        if (Object.keys(nonDishFoodData).length > 0) {
            bulkWriteOperations.push({
                updateOne: {
                    'filter': { _id: new ObjectId(dishID), userID: userID },
                    'update': { $set: nonDishFoodData }
                }
            })
        }
        const dishFoodData: number[] = data.foods
        dishFoodData.forEach((dishFoodDefaultServing, index) => {
            bulkWriteOperations.push({
                updateOne: {
                    'filter': { _id: new ObjectId(dishID), userID: userID },
                    'update': { $set: { [`foods.${index}.defaultServing`]: dishFoodDefaultServing } }
                }
            })
        })

        // Update dish
        const result = await client.db("CalPal").collection("dishes").bulkWrite(bulkWriteOperations)

        if (!result.modifiedCount) {
            throw new Error(`Failed To Update Dish: ${userID} ${dishID}`)
        }

        utils.routeLog(req, `Dish Updated: ${userID} ${dishID}`)

        res.status(200).send('Dish updated.')
    } catch (error: any) {
        utils.routeLog(req, error.message)
        res.status(500).send(error)
    } finally {
        await client.close()
    }
}