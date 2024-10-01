import { client } from "../database"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

import {Request, Response} from 'express'
import { validateData, routeLog } from "../utils"

dotenv.config()

export async function login (req: Request, res: Response) {
    try {
        await client.connect()

        const data = req.body

        // Data Validation  
        const schema = {
            email: "",
            hash: "",
            rememberMe: false
        }
        if (!validateData(req, res, data, schema)) {
            return
        }

        const user = await client.db("CalPal").collection("users").findOne({ email: data.email })

        // Check if user exists
        if (!user) {
            routeLog(req, `Invalid Credentials: ${data.email}`)
            res.status(404).send("Invalid Credentials.")
            return
        }

        // Check if user is disabled
        if (user.loginAttempt >= 999) {
            routeLog(req, `User Disabled: ${data.email}`)
            res.status(401).send("User is disabled.")
            return
        }

        // Check if user is locked out
        if (user.loginAttempt > 3) {
            const currentTime = new Date()
            const lockoutTime = new Date(user.lastFailedAttempt)
            lockoutTime.setMinutes(lockoutTime.getMinutes() + ((user.loginAttempt - 3) * 5))

            if (currentTime < lockoutTime) {
                routeLog(req, `User Locked Out: ${data.email}`)
                res.status(401).send(`User is locked out. Please try again in ${Math.ceil((lockoutTime.getTime() - currentTime.getTime()) / 60000)} minutes.`)
                return
            }
        }

        // Check if hash matches
        if (user.hash !== data.hash) {
            await client.db("CalPal").collection("users").updateOne({ _id: user._id }, { 
                $inc: { loginAttempt: 1},
                $set: { lastFailedAttempt: new Date() } 
            })

            routeLog(req, `Invalid Credentials: ${data.email}`)
            res.status(404).send("Invalid Credentials.")
            return
        }

        // Reset login attempts
        await client.db("CalPal").collection("users").updateOne({ _id: user._id }, { 
            $set: { loginAttempt: 0 } 
        })

        const userToken = jwt.sign({ userID: user._id, email: user.email }, process.env.SECRET_KEY || '', { expiresIn: data.rememberMe ? "30d" : "1d" })

        routeLog(req, `User Authenticated: ${user.email}`)
        res.cookie("userToken", userToken, { httpOnly: true })
        res.status(200).send("User Authenticated.")
    } catch(error: any) {
        routeLog(req, error.message)
        res.status(500).send(error)
    } finally {
        await client.close()
    }
}