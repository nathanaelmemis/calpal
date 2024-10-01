import {Request, Response} from 'express'
import { client } from '../database'
import { ObjectId } from 'mongodb'
import { validateData, routeLog } from '../utils'

export async function deleteAccount(req: Request, res: Response) {
    try {
        await client.connect()

        const data = req.body
        const userID = data.userID

        // Data Validation
        const schema = {
            userID: "",
            email: "",
            hash: "",
        }
        if (!validateData(req, res, data, schema)) {
            return
        }

        routeLog(req, `Deleting Account: ${userID}`)

        const user = await client.db("CalPal").collection("users").findOne({ email: data.email, hash: data.hash })

        if (!user) {
            routeLog(req, `Invalid Credentials: ${data.email}`)
            res.status(404).send("Invalid Credentials.")
            return
        }

        // Delete user data from users collection
        const deleteOnUsersResult = await client.db("CalPal").collection("users").deleteOne({
            _id: new ObjectId(userID),
        })

        // Delete user data from userData collection
        const deleteOnUserDataResult = await client.db("CalPal").collection("userData").deleteOne({
            userID: userID
        })

        // Delete user data from foods collection
        const deleteOnFoodsResult = await client.db("CalPal").collection("foods").deleteMany({
            userID: userID
        })

        // Delete user data from dishes collection
        const deleteOnDishesResult = await client.db("CalPal").collection("dishes").deleteMany({
            userID: userID
        })

        // Delete user data from foodEaten collection
        const deleteOnFoodEatenResult = await client.db("CalPal").collection("foodEaten").deleteMany({
            userID: userID
        })

        // Delete user data from dishEaten collection
        const deleteOnDishEatenResult = await client.db("CalPal").collection("dishEaten").deleteMany({
            userID: userID
        })

        // Check if any data was deleted
        if (!deleteOnUsersResult.deletedCount || !deleteOnUserDataResult.deletedCount) {
            throw new Error(`Failed To Delete Account: ${userID}`)
        }
        
        routeLog(req, `Account Deleted: ${userID} ${deleteOnUsersResult.deletedCount} ${deleteOnUserDataResult.deletedCount} ${deleteOnFoodsResult.deletedCount} ${deleteOnDishesResult.deletedCount} ${deleteOnFoodEatenResult.deletedCount} ${deleteOnDishEatenResult.deletedCount}`)

        res.sendStatus(200)
    } catch (error: any) {
        routeLog(req, error.message)
        res.status(500).send(error)
    } finally {
        await client.close()
    }
}