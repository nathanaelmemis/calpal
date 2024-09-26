import {Request, Response} from 'express'
import { client } from '../database'
import { ObjectId } from 'mongodb'
import { validateData, routeLog } from '../utils'

export async function updateFoodEaten(req: Request, res: Response) {
    try {
        await client.connect()

        const data = req.body
        const userID = data.userID
        const foodEatenID = data.foodEatenID

        // Data Validation
        // Don't include date since it's not being updated
        const schema = {
            userID: "",
            foodEatenID: "",
            mealType: "",
            foodID: "",
            grams: 0,
            quantity: 0,
        }
        if (!validateData(req, res, data, schema)) {
            return
        }

        routeLog(req, `Updating Food Eaten: ${userID} ${foodEatenID}`)

        // Remove data that doesn't need to be updated
        delete data.foodEatenID
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

        const result = await client.db("CalPal").collection("foodEaten").updateOne({ _id: new ObjectId(foodEatenID), userID: userID }, { $set: data })

        if (!result.matchedCount) {
            throw new Error("Failed to update food eaten.")
        }

        routeLog(req, `Food Eaten Updated: ${userID} ${foodEatenID}`)

        res.status(200).send(`Food Eaten Updated`)
    } catch (error: any) {
        routeLog(req, error.message)
        res.status(500).send(error)
    } finally {
        await client.close()
    }
}