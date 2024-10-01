"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookieJwtAuth = cookieJwtAuth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const utils_1 = require("../utils");
dotenv_1.default.config();
function cookieJwtAuth(req, res, next) {
    try {
        const userToken = req.cookies.userToken;
        if (!userToken) {
            throw new Error("No cookie token.");
        }
        const decoded = jsonwebtoken_1.default.verify(userToken, process.env.SECRET_KEY || '');
        req.body.userID = decoded.userID;
        next();
    }
    catch (error) {
        (0, utils_1.routeLog)(req, error.message);
        res.clearCookie("userToken");
        res.status(401).send("Unauthorized.");
    }
}
