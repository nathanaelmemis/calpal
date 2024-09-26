"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = changePassword;
const database_1 = require("../database");
const utils_1 = require("../utils");
const jwt = require("jsonwebtoken");
const crypto_js_1 = __importDefault(require("crypto-js"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function changePassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield database_1.client.connect();
            const data = req.body;
            // Data Validation  
            const schema = {
                userID: "string",
                email: "",
                hash: "",
                newHash: ""
            };
            if (!(0, utils_1.validateData)(req, res, data, schema)) {
                return;
            }
            (0, utils_1.routeLog)(req, `Changing Password: ${data.userID}`);
            const signedHash = crypto_js_1.default.SHA256(data.hash + process.env.SECRET_KEY).toString(crypto_js_1.default.enc.Hex);
            const user = yield database_1.client.db("CalPal").collection("users").findOne({ email: data.email, hash: signedHash });
            if (!user) {
                (0, utils_1.routeLog)(req, `Invalid Credentials: ${data.email} ${signedHash}`);
                res.status(400).send("Invalid Credentials.");
                return;
            }
            const signedNewHash = crypto_js_1.default.SHA256(data.newHash + process.env.SECRET_KEY).toString(crypto_js_1.default.enc.Hex);
            const result = yield database_1.client.db("CalPal").collection("users").updateOne({
                email: data.email,
                hash: signedHash
            }, {
                $set: {
                    hash: signedNewHash
                }
            });
            if (!result.matchedCount) {
                (0, utils_1.routeLog)(req, `Failed to change password: ${data.userID}`);
                res.status(400).send("Failed to change password.");
                return;
            }
            (0, utils_1.routeLog)(req, `Password Changed: ${data.userID}`);
            res.clearCookie("userToken");
            res.status(200).send("Password Changed.");
        }
        catch (error) {
            (0, utils_1.routeLog)(req, error.message);
            res.status(500).send(error);
        }
        finally {
            yield database_1.client.close();
        }
    });
}
