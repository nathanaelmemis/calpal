import {Request, Response} from 'express'
import { client } from '../database'
import { routeLog, validateData } from "../utils"

export async function addFoodEaten(req: Request, res: Response) {
    try {
        await client.connect()

        const data = req.body

        // Data Validation
        const schema = {
            userID: "",
            mealType: "",
            foodID: "",
            date: "",
            grams: 0,
            quantity: 0,
        }
        if (!validateData(req, res, data, schema)) {
            return
        }

        // convert date string to Date object
        data.date = new Date(data.date)

        routeLog(req, `Adding Food Eaten: ${req.body.userID}`)

        const result = await client.db("CalPal").collection("foodEaten").insertOne(data)

        if (!result.insertedId) {
            throw new Error("Failed to insert food eaten.")
        }
        
        routeLog(req, `Food Eaten added: ${result.insertedId}`)

        res.status(200).send(result.insertedId)
    } catch (error: any) {
        routeLog(req, error.message)
        res.status(500).send(error)
    } finally {
        await client.close()
    }
}