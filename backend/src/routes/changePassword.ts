import { client } from "../database"
const utils = require("../utils.ts")
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
            newHash: ""
        }
        if (!utils.validateData(req, res, data, schema)) {
            return
        }

        utils.routeLog(req, `Changing Password: ${data.userID}`)

        const signedHash = CryptoJS.SHA256(data.hash + process.env.SECRET_KEY).toString(CryptoJS.enc.Hex)

        const user = await client.db("CalPal").collection("users").findOne({ email: data.email, hash: signedHash })

        if (!user) {
            utils.routeLog(req, `Invalid Credentials: ${data.email} ${signedHash}`)
            res.status(400).send("Invalid Credentials.")
            return
        }

        const signedNewHash = CryptoJS.SHA256(data.newHash + process.env.SECRET_KEY).toString(CryptoJS.enc.Hex)

        const result = await client.db("CalPal").collection("users").updateOne({
            email: data.email,
            hash: signedHash
        }, {
            $set: {
                hash: signedNewHash
            }
        })

        if (!result.matchedCount) {
            utils.routeLog(req, `Failed to change password: ${data.userID}`)
            res.status(400).send("Failed to change password.")
            return
        }

        utils.routeLog(req, `Password Changed: ${data.userID}`)
        res.clearCookie("userToken")
        res.status(200).send("Password Changed.")
    } catch(error) {
        utils.routeLog(req, error)
        res.status(500).send(error)
    } finally {
        await client.close()
    }
}