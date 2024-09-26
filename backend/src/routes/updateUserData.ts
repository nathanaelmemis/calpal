import { client } from "../database"

import {Request, Response} from 'express'
import { validateData, routeLog } from "../utils"

export async function updateUserData(req: Request, res: Response) {
    try {
        await client.connect()

        const userID = req.body.userID
        const data = req.body
        
        // Data Validation
        const schema = {
            userID: "",
            name: "",
            caloriesLimit: 0,
            proteinLimit: 0,
            carbsLimit: 0,
            fatsLimit: 0,
            breakfastCaloriesLimit: 0,
            lunchCaloriesLimit: 0,
            snacksCaloriesLimit: 0,
            dinnerCaloriesLimit: 0,
        }
        if (!validateData(req, res, data, schema)) {
            return
        }

        routeLog(req, `Updating User Data: ${userID}`)

        // Remove data that doesn't need to be updated
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

        // Update user data
        await client.db("CalPal").collection("userData").updateOne({ userID: userID }, { $set: data })

        routeLog(req, `User Data Updated: ${userID}`)

        res.status(200).send('User data updated.')
    } catch (error: any) {
        routeLog(req, error.message)
        res.status(500).send(error)
    } finally {
        await client.close()
    }
}