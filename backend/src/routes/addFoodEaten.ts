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

        if (data.foodID === "") {
            res.status(400).send("No food given.")
            return
        }

        routeLog(req, `Adding Food Eaten: ${data.userID}`)

        const result = await client.db("CalPal").collection("foodEaten").insertOne(data)

        if (!result.insertedId) {
            throw new Error("Failed to insert food eaten.")
        }
        
        routeLog(req, `Food Eaten added: ${result.insertedId}`)

        res.status(200).send({_id: result.insertedId, userID: data.userID})
    } catch (error: any) {
        routeLog(req, error.message)
        res.status(500).send(error)
    } finally {
        await client.close()
    }
}