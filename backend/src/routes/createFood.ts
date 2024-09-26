import { client } from "../database"
import { routeLog, validateData } from '../utils'
const assert = require('assert');

import {Request, Response} from 'express'

export async function createFood(req: Request, res: Response) {
    try {
        await client.connect()

        const userID = req.body.userID
        const data = req.body
        
        // Data Validation
        const schema = {
            userID: "",
            name: "",
            defaultServing: 0,
            calories: 0,
            protein: 0,
            carbs: 0,
            fats: 0
        }
        if (!validateData(req, res, data, schema)) {
            return
        }

        routeLog(req, `Creating Food: ${userID} ${data.name}`)

        // Retrieve food & dish data
        const duplicateFood = await client.db("CalPal").collection("foods").find({ userID: userID, name: data.name}).toArray()
        const duplicateDish = await client.db("CalPal").collection("dish").find({ userID: userID, name: data.name}).toArray()

        // Check if dish in foods or dish already exists
        if (duplicateFood.length > 0 || duplicateDish.length > 0) {
            routeLog(req, "Food already exists.")
            res.status(400).send("Food already exists.")
            return
        }

        // Insert food data
        const result = await client.db("CalPal").collection("foods").insertOne(data)

        // Check if food was inserted
        if (!result.insertedId) {
            throw new Error("Failed to create food.")
        }

        routeLog(req, `Food Created: ${req.body.userID} ${result.insertedId}`)

        res.status(200).send(result.insertedId)
    } catch (error: any) {
        routeLog(req, error.message)
        res.status(500).send(error)
    } finally {
        await client.close()
    }
}