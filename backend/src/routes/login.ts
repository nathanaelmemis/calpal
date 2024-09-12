import { client } from "../database"
const utils = require("../utils.ts")
const jwt = require("jsonwebtoken")
import CryptoJS from "crypto-js"
import dotenv from "dotenv"

import {Request, Response} from 'express'

dotenv.config()

export async function login (req: Request, res: Response) {
    try {
        await client.connect()

        const data = req.body

        // Data Validation  
        const schema = {
            email: "",
            hash: ""
        }
        if (!utils.validateData(req, res, data, schema)) {
            return
        }

        const signedHash = CryptoJS.SHA256(data.hash + process.env.SECRET_KEY).toString(CryptoJS.enc.Hex)

        const user = await client.db("CalPal").collection("users").findOne({ email: data.email, hash: signedHash })

        if (!user) {
            utils.routeLog(req, `Invalid Credentials: ${data.email} ${signedHash}`)
            res.status(404).send("Invalid Credentials.")
            return
        }

        const userToken = jwt.sign({ userID: user._id, email: user.email }, process.env.SECRET_KEY, { expiresIn: "1h" })

        utils.routeLog(req, `User Authenticated: ${user.email}`)
        res.cookie("userToken", userToken, { httpOnly: true })
        res.status(200).send("User Authenticated.")
    } catch(error) {
        utils.routeLog(req, error)
        res.status(500).send(error)
    } finally {
        await client.close()
    }
}