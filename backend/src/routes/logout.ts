import {Request, Response} from 'express'
import { routeLog } from '../utils';

export async function logout (req: Request, res: Response) {
    routeLog(req, 'A User Logged Out.');
    res.clearCookie("userToken");
    res.status(200).send("User Logged Out.");
}