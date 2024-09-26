import { client } from "../database"
const utils = require("../utils.ts")
const jwt = require("jsonwebtoken")
import CryptoJS from "crypto-js"
import dotenv from "dotenv"

import {Request, Response} from 'express'

dotenv.config()

export async function register (req: Request, res: Response) {
    try {
        await client.connect()

        const data = req.body

        const emailAlreadyUsed = await client.db("CalPal").collection("users").findOne({ email: data.email })

        if (emailAlreadyUsed) {
            res.status(400).send("Email already used.")
            return
        }

        const signedHash = CryptoJS.SHA256(data.hash + process.env.SECRET_KEY).toString(CryptoJS.enc.Hex)

        const usersResult = await client.db("CalPal").collection("users").insertOne({ email: data.email, hash: signedHash })

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

        utils.routeLog(req, `Account registered: ${data.email}`)

        res.status(200).send("Account registered.")
    } catch(error) {
        utils.routeLog(req, error)
        res.status(500).send(error)
    } finally {
        await client.close()
    }
}