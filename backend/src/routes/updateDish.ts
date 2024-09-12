import { ObjectId } from "mongodb";
import { client } from "../database"
const utils = require("../utils.ts")
const assert = require('assert');

import {Request, Response} from 'express'

export async function updateDish(req: Request, res: Response) {
    try {
        await client.connect()

        const data = req.body
        const userID = data.userID
        const dishID = data.dishID
        
        // Data Validation  
        const schema = {
            dishID: "",
            userID: "",
            name: "",
            defaultServing: 0,
            foods: [{food: "", defaultServing: 0}]
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

        // Update dish
        await client.db("CalPal").collection("dishes").updateOne({ _id: new ObjectId(dishID), userID: userID }, { $set: data })

        utils.routeLog(req, `Dish Updated: ${userID} ${dishID}`)

        res.status(200).send('Dish updated.')
    } catch (error: any) {
        utils.routeLog(req, error.message)
        res.status(500).send(error)
    } finally {
        await client.close()
    }
}