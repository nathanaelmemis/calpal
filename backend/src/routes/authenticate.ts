import {Request, Response} from 'express'
import { routeLog } from '../utils'

export function authenticate(req: Request, res: Response) {
    routeLog(req, `User Authenticated: ${req.body.userID}`)
    
    res.status(200).send("User Authenticated.")
}