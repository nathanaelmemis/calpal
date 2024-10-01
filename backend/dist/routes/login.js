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
exports.login = login;
const database_1 = require("../database");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const utils_1 = require("../utils");
dotenv_1.default.config();
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield database_1.client.connect();
            const data = req.body;
            // Data Validation  
            const schema = {
                email: "",
                hash: "",
                rememberMe: false
            };
            if (!(0, utils_1.validateData)(req, res, data, schema)) {
                return;
            }
            const user = yield database_1.client.db("CalPal").collection("users").findOne({ email: data.email });
            // Check if user exists
            if (!user) {
                (0, utils_1.routeLog)(req, `Invalid Credentials: ${data.email}`);
                res.status(404).send("Invalid Credentials.");
                return;
            }
            // Check if user is disabled
            if (user.loginAttempt >= 999) {
                (0, utils_1.routeLog)(req, `User Disabled: ${data.email}`);
                res.status(401).send("User is disabled.");
                return;
            }
            // Check if user is locked out
            if (user.loginAttempt > 3) {
                const currentTime = new Date();
                const lockoutTime = new Date(user.lastFailedAttempt);
                lockoutTime.setMinutes(lockoutTime.getMinutes() + ((user.loginAttempt - 3) * 5));
                if (currentTime < lockoutTime) {
                    (0, utils_1.routeLog)(req, `User Locked Out: ${data.email}`);
                    res.status(401).send(`User is locked out. Please try again in ${Math.ceil((lockoutTime.getTime() - currentTime.getTime()) / 60000)} minutes.`);
                    return;
                }
            }
            // Check if hash matches
            if (user.hash !== data.hash) {
                yield database_1.client.db("CalPal").collection("users").updateOne({ _id: user._id }, {
                    $inc: { loginAttempt: 1 },
                    $set: { lastFailedAttempt: new Date() }
                });
                (0, utils_1.routeLog)(req, `Invalid Credentials: ${data.email}`);
                res.status(404).send("Invalid Credentials.");
                return;
            }
            // Reset login attempts
            yield database_1.client.db("CalPal").collection("users").updateOne({ _id: user._id }, {
                $set: { loginAttempt: 0 }
            });
            const userToken = jsonwebtoken_1.default.sign({ userID: user._id, email: user.email }, process.env.SECRET_KEY || '', { expiresIn: data.rememberMe ? "30d" : "1d" });
            (0, utils_1.routeLog)(req, `User Authenticated: ${user.email}`);
            res.cookie("userToken", userToken, { httpOnly: true });
            res.status(200).send("User Authenticated.");
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
