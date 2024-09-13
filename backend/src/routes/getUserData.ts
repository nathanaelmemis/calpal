import { client } from "../database"
const utils = require("../utils.ts")
import moment from "moment"

import {Request, Response} from 'express'

interface FoodEatenInterface {
    _id: string,
    userID: string,
    mealType: string,
    date: string,
    food: string,
    grams: number,
    quantity: number,
}

interface DetailedFoodEatenInterface extends FoodEatenInterface {
    calories: number
    carbs: number
    protein: number
    fats: number
}

export async function getUserData(req: Request, res: Response) {
    try {
        await client.connect()

        const userID = req.body.userID

        utils.routeLog(req, `Getting User Data: ${userID}`)

        // Retrieve user data
        const userData = await client.db("CalPal").collection("userData").findOne({ userID: userID })
        const foods = await client.db("CalPal").collection("foods").find({ userID: userID }).toArray()
        const dishes = await client.db("CalPal").collection("dishes").find({ userID: userID }).toArray()
        const foodEaten = await client.db("CalPal").collection("foodEaten").find({ userID: userID, date: { $gte: moment().startOf('day').toDate()} }).toArray()
        const dishEaten = await client.db("CalPal").collection("dishEaten").find({ userID: userID, date: { $gte: moment().startOf('day').toDate()} }).toArray()

        utils.routeLog(req, `User Data Found: ${userID}`)

        res.status(200).send({ userData, foods, dishes, foodEaten, dishEaten })
    } catch (error) {
        utils.routeLog(req, error)
        res.status(500).send(error)
    } finally {
        await client.close()
    }
}