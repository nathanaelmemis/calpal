const jwt = require("jsonwebtoken");
import dotenv from 'dotenv'
const utils = require("../utils.ts")

dotenv.config();

import {Request, Response, NextFunction} from 'express';

export function cookieJwtAuth(req: Request, res: Response, next: NextFunction) {
    try {
        const userToken = req.cookies.userToken;

        if (!userToken) {
            throw new Error("No cookie token.");
        }

        const decoded = jwt.verify(userToken, process.env.SECRET_KEY);
        req.body.userID = decoded.userID;
        next();
    } catch(error: any) {
        utils.routeLog(req, error.message);
        res.clearCookie("userToken");
        res.status(401).send("Unauthorized.");
    }
}