import { client } from "../database"
const jwt = require("jsonwebtoken")

import {Request, Response} from 'express'
import { validateData, routeLog } from "../utils"

export async function getSalt (req: Request, res: Response) {
    try {
        await client.connect()

        const data = req.query

        // Data Validation  
        const schema = {
            email: ""
        }
        if (!validateData(req, res, data, schema)) {
            return
        }

        const user = await client.db("CalPal").collection("users").findOne({ email: data.email })

        if (!user) {
            routeLog(req, `Invalid Credentials: ${data.email}`)
            res.status(404).send("Invalid Credentials.")
            return
        }

        routeLog(req, `Salt Retrieved: ${user.email}`)

        res.status(200).send({ salt: user.salt })
    } catch(error: any) {
        routeLog(req, error.message)
        res.status(500).send(error)
    } finally {
        await client.close()
    }
}