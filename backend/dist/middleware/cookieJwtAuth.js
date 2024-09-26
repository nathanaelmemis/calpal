"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookieJwtAuth = cookieJwtAuth;
const jwt = require("jsonwebtoken");
const dotenv_1 = __importDefault(require("dotenv"));
const utils = require("../utils.ts");
dotenv_1.default.config();
function cookieJwtAuth(req, res, next) {
    try {
        const userToken = req.cookies.userToken;
        if (!userToken) {
            throw new Error("No cookie token.");
        }
        const decoded = jwt.verify(userToken, process.env.SECRET_KEY);
        req.body.userID = decoded.userID;
        next();
    }
    catch (error) {
        utils.routeLog(req, error.message);
        res.clearCookie("userToken");
        res.status(401).send("Unauthorized.");
    }
}
