import { ObjectId } from "mongodb";
import { client } from "../database"
const utils = require("../utils.ts")
const assert = require('assert');

import {Request, Response} from 'express'

export async function updateDishEaten(req: Request, res: Response) {
    try {
        await client.connect()

        const data = req.body
        const userID = data.userID
        const dishEatenID = data.dishEatenID
        
        // Data Validation  
        // Don't include date since it's not being updated
        const schema = {
            dishEatenID: "",
            userID: "",
            dish: "",
            grams: 0,
            quantity: 0,
            mealType: "",
            foodServing: [0]
        }
        if (!utils.validateData(req, res, data, schema)) {
            return
        }

        utils.routeLog(req, `Updating Dish Eaten: ${userID} ${dishEatenID}`)

        // Remove data that doesn't need to be updated
        delete data.dishEatenID
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

        // Update dish
        const result = await client.db("CalPal").collection("dishEaten").updateOne({ _id: new ObjectId(dishEatenID), userID: userID }, { $set: data })

        if (!result.matchedCount) {
            throw new Error("Failed to update dish eaten.")
        }

        utils.routeLog(req, `Dish Eaten Updated: ${userID} ${dishEatenID}`)

        res.status(200).send('Dish Eaten updated.')
    } catch (error: any) {
        utils.routeLog(req, error.message)
        res.status(500).send(error)
    } finally {
        await client.close()
    }
}