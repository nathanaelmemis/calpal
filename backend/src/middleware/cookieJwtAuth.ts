import jwt from "jsonwebtoken"
import dotenv from 'dotenv'
import { routeLog } from "../utils";

dotenv.config();

import {Request, Response, NextFunction} from 'express';

export function cookieJwtAuth(req: Request, res: Response, next: NextFunction) {
    try {
        const userToken = req.cookies.userToken;

        if (!userToken) {
            throw new Error("No cookie token.");
        }

        const decoded = jwt.verify(userToken, process.env.SECRET_KEY || '') as {userID: string, email: string};
        req.body.userID = decoded.userID;
        next();
    } catch(error: any) {
        routeLog(req, error.message);
        res.clearCookie("userToken");
        res.status(401).send("Unauthorized.");
    }
}