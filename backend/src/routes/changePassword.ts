import { client } from "../database"
import { routeLog, validateData } from '../utils'
const jwt = require("jsonwebtoken")
import CryptoJS from "crypto-js"
import dotenv from "dotenv"

import {Request, Response} from 'express'

dotenv.config()

export async function changePassword (req: Request, res: Response) {
    try {
        await client.connect()

        const data = req.body

        // Data Validation  
        const schema = {
            userID: "string",
            email: "",
            hash: "",
            newSalt: "",
            newHash: "",
        }
        if (!validateData(req, res, data, schema)) {
            return
        }

        routeLog(req, `Changing Password: ${data.userID}`)

        const user = await client.db("CalPal").collection("users").findOne({ email: data.email, hash: data.hash })

        if (!user) {
            routeLog(req, `Invalid Credentials: ${data.email}`)
            res.status(400).send("Invalid Credentials.")
            return
        }

        const result = await client.db("CalPal").collection("users").updateOne({
            email: data.email,
            hash: data.hash
        }, {
            $set: {
                salt: data.newSalt,
                hash: data.newHash
            }
        })

        if (!result.matchedCount) {
            routeLog(req, `Failed to change password: ${data.userID}`)
            res.status(400).send("Failed to change password.")
            return
        }

        routeLog(req, `Password Changed: ${data.userID}`)
        res.clearCookie("userToken")
        res.status(200).send("Password Changed.")
    } catch(error: any) {
        routeLog(req, error.message)
        res.status(500).send(error)
    } finally {
        await client.close()
    }
}