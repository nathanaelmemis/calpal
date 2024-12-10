import {Request, Response} from 'express'
import { client } from '../database'
import { routeLog, validateData } from "../utils"

export async function addDishEaten(req: Request, res: Response) {
    try {
        await client.connect()

        const data = req.body

        // Data Validation
        const schema = {
            userID: "",
            mealType: "",
            dishID: "",
            date: "",
            grams: 0,
            quantity: 0,
            foodServing: [0]
        }
        if (!validateData(req, res, data, schema)) {
            return
        }

        if (data.dishID === "") {
            res.status(400).send("No dish given.")
            return
        }

        routeLog(req, `Adding Dish Eaten: ${req.body.userID}`)

        const result = await client.db("CalPal").collection("dishEaten").insertOne(data)

        if (!result.insertedId) {
            throw new Error("Failed to insert dish eaten.")
        }
        
        routeLog(req, `Dish Eaten added: ${result.insertedId}`)

        res.status(200).send({_id: result.insertedId, userID: data.userID})
    } catch (error: any) {
        routeLog(req, error.message)
        res.status(500).send(error)
    } finally {
        await client.close()
    }
}