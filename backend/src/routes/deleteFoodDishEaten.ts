import {Request, Response} from 'express'
import { client } from '../database'
import { ObjectId } from 'mongodb'
const utils = require("../utils.ts")

export async function deleteFoodDishEaten(req: Request, res: Response) {
    try {
        await client.connect()

        const data = req.body
        const userID = data.userID
        const foodDishEatenID = data.foodDishEatenID

        // Data Validation
        const schema = {
            userID: "",
            foodDishEatenID: "",
            isDish: true,
        }
        if (!utils.validateData(req, res, data, schema)) {
            return
        }

        utils.routeLog(req, `Deleting Food/Dish Eaten: ${userID} ${foodDishEatenID}`)

        let result = null
        if (data.isDish) {
            result = await client.db("CalPal").collection("dishEaten").deleteOne({
                _id: new ObjectId(foodDishEatenID),
                userID: userID
            })
        } else {
            result = await client.db("CalPal").collection("foodEaten").deleteOne({
                _id: new ObjectId(foodDishEatenID),
                userID: userID
            })
        }

        if (!result.deletedCount) {
            throw new Error("Failed to insert dish eaten.")
        }
        
        utils.routeLog(req, `Food/Dish Eaten deleted: ${userID} ${foodDishEatenID}`)

        res.status(200).send(result.insertedId)
    } catch (error: any) {
        utils.routeLog(req, error.message)
        res.status(500).send(error)
    } finally {
        await client.close()
    }
}