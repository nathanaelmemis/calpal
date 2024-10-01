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
exports.register = register;
const database_1 = require("../database");
const dotenv_1 = __importDefault(require("dotenv"));
const utils_1 = require("../utils");
dotenv_1.default.config();
function register(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield database_1.client.connect();
            const data = req.body;
            data.lastFailedAttempt = new Date();
            const emailAlreadyUsed = yield database_1.client.db("CalPal").collection("users").findOne({ email: data.email });
            if (emailAlreadyUsed) {
                res.status(400).send("Email already used.");
                return;
            }
            const usersResult = yield database_1.client.db("CalPal").collection("users").insertOne({
                email: data.email,
                salt: data.salt,
                hash: data.hash,
                loginAttempt: 0,
                lastFailedAttempt: data.lastFailedAttempt,
            });
            if (!usersResult.insertedId) {
                throw new Error('Failed to register account.');
            }
            // initial user data
            const userDataResult = yield database_1.client.db("CalPal").collection("userData").insertOne({
                userID: usersResult.insertedId.toString(),
                name: data.name,
                caloriesLimit: 2000,
                proteinLimit: 100,
                carbsLimit: 300,
                fatsLimit: 100,
                breakfastCaloriesLimit: 500,
                lunchCaloriesLimit: 700,
                dinnerCaloriesLimit: 450,
                snacksCaloriesLimit: 350,
            });
            if (!userDataResult.insertedId) {
                throw new Error('Failed to register account.');
            }
            (0, utils_1.routeLog)(req, `Account registered: ${data.email}`);
            res.status(200).send("Account registered.");
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
