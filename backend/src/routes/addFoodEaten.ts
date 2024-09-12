import {Request, Response} from 'express'
import { client } from '../database'
const utils = require("../utils.ts")

export async function addFoodEaten(req: Request, res: Response) {
    try {
        await client.connect()

        const data = req.body
        data.date = new Date()

        // Data Validation
        const schema = {
            userID: "",
            mealType: "",
            food: "",
            date: data.date,
            grams: 0,
            quantity: 0,
        }
        if (!utils.validateData(req, res, data, schema)) {
            return
        }

        utils.routeLog(req, `Adding Food Eaten: ${req.body.userID}`)

        const result = await client.db("CalPal").collection("foodEaten").insertOne(data)

        if (!result.insertedId) {
            throw new Error("Failed to insert food eaten.")
        }
        
        utils.routeLog(req, `Food Eaten added: ${result.insertedId}`)

        res.status(200).send(result.insertedId)
    } catch (error: any) {
        utils.routeLog(req, error.message)
        res.status(500).send(error)
    } finally {
        await client.close()
    }
}