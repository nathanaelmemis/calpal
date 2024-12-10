import { ObjectId } from "mongodb";
import { client } from "../database"

import {Request, Response} from 'express'
import { validateData, routeLog } from "../utils";

export async function updateFood(req: Request, res: Response) {
    try {
        await client.connect()

        const data = req.body
        const userID = data.userID
        const foodID = data.foodID
        
        // Data Validation
        const schema = {
            foodID: "",
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

        routeLog(req, `Updating Food: ${userID} ${foodID}`)

        // Retrieve food & dish data
        const duplicateFood = await client.db("CalPal").collection("foods").find({ userID: userID, name: data.name}).toArray()
        const duplicateDish = await client.db("CalPal").collection("dish").find({ userID: userID, name: data.name}).toArray()

        // Check if dish in foods or dish already exists
        if (duplicateFood.length > 0 || duplicateDish.length > 0) {
            routeLog(req, "Food already exists.")
            res.status(400).send("Food already exists.")
            return
        }

        // Remove data that doesn't need to be updated
        delete data.foodID
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

        // Update food
        await client.db("CalPal").collection("foods").updateOne({ _id: new ObjectId(foodID), userID: userID }, { $set: data })

        routeLog(req, `Food Updated: ${userID} ${foodID}`)

        res.status(200).send({ userID: userID })
    } catch (error: any) {
        routeLog(req, error.message)
        res.status(500).send(error)
    } finally {
        await client.close()
    }
}