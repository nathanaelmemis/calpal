const utils = require("../utils.ts")

import {Request, Response} from 'express'

export async function logout (req: Request, res: Response) {
    utils.routeLog(req, 'A User Logged Out.');
    res.clearCookie("userToken");
    res.status(200).send("User Logged Out.");
}