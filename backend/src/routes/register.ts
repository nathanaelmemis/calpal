import { client } from "../database"
import dotenv from "dotenv"

import {Request, Response} from 'express'
import { routeLog } from "../utils"

dotenv.config()

export async function register (req: Request, res: Response) {
    try {
        await client.connect()

        const data = req.body
        data.lastFailedAttempt = new Date()

        const emailAlreadyUsed = await client.db("CalPal").collection("users").findOne({ email: data.email })

        if (emailAlreadyUsed) {
            res.status(400).send("Email already used.")
            return
        }

        const usersResult = await client.db("CalPal").collection("users").insertOne({ 
            email: data.email, 
            salt: data.salt, 
            hash: data.hash, 
            loginAttempt: 0,
            lastFailedAttempt: data.lastFailedAttempt,
        })

        if (!usersResult.insertedId) {
            throw new Error('Failed to register account.')
        }

        // initial user data
        const userDataResult = await client.db("CalPal").collection("userData").insertOne({ 
            userID: usersResult.insertedId.toString(),
            name: data.name,
            caloriesLimit: 2000,
            proteinLimit: 100,
            carbsLimit: 300,
            fatsLimit: 100,
            breakfastCaloriesLimit: 500,
            lunchCaloriesLimit: 700,
            dinnerCaloriesLimit: 450,
            snacksCaloriesLimit: 350,
        })

        if (!userDataResult.insertedId) {
            throw new Error('Failed to register account.')
        }

        routeLog(req, `Account registered: ${data.email}`)

        res.status(200).send("Account registered.")
    } catch(error: any) {
        routeLog(req, error.message)
        res.status(500).send(error)
    } finally {
        await client.close()
    }
}