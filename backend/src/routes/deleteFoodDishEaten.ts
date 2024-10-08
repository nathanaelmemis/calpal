import {Request, Response} from 'express'
import { client } from '../database'
import { ObjectId } from 'mongodb'
import { validateData, routeLog } from '../utils'

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
        if (!validateData(req, res, data, schema)) {
            return
        }

        routeLog(req, `Deleting Food/Dish Eaten: ${userID} ${foodDishEatenID}`)

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
            throw new Error(`Failed To Delete Food/Dish Eaten: ${userID} ${foodDishEatenID}`)
        }
        
        routeLog(req, `Food/Dish Eaten deleted: ${userID} ${foodDishEatenID}`)

        res.sendStatus(200)
    } catch (error: any) {
        routeLog(req, error.message)
        res.status(500).send(error)
    } finally {
        await client.close()
    }
}