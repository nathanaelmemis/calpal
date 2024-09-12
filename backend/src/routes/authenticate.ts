import {Request, Response} from 'express'
const utils = require("../utils.ts")

export function authenticate(req: Request, res: Response) {
    utils.routeLog(req, `User Authenticated: ${req.body.userID}`)
    
    res.status(200).send("User Authenticated.")
}