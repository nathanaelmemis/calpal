import { client } from "../database"
const utils = require("../utils.ts")
const assert = require('assert');

import {Request, Response} from 'express'

export async function createDish(req: Request, res: Response) {
    try {
        await client.connect()

        const userID = req.body.userID
        const data = req.body
        
        // Data Validation
        const schema = {
            userID: "",
            name: "",
            defaultServing: 0,
            foods: [
                {
                    foodID: "", 
                    defaultServing: 0
                },
            ]
        }
        if (!utils.validateData(req, res, data, schema)) {
            return
        }

        utils.routeLog(req, `Creating Dish: ${userID} ${data.name}`)

        // Retrieve food & dish data
        const duplicateFood = await client.db("CalPal").collection("foods").find({ userID: userID, name: data.name}).toArray()
        const duplicateDish = await client.db("CalPal").collection("dishes").find({ userID: userID, name: data.name}).toArray()

        // Check if dish in foods or dish already exists
        if (duplicateFood.length > 0 || duplicateDish.length > 0) {
            utils.routeLog(req, "Dish already exists.")
            res.status(400).send("Dish already exists.")
            return
        }

        // Insert dish data
        const result = await client.db("CalPal").collection("dishes").insertOne(data)

        // Check if dish was inserted
        if (!result.insertedId) {
            throw new Error("Failed to create dish.")
        }

        utils.routeLog(req, `Dish Created: ${req.body.userID} ${result.insertedId}`)

        res.status(200).send(result.insertedId)
    } catch (error: any) {
        utils.routeLog(req, error.message)
        res.status(500).send(error)
    } finally {
        await client.close()
    }
}