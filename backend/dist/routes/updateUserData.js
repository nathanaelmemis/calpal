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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserData = updateUserData;
const database_1 = require("../database");
const utils_1 = require("../utils");
function updateUserData(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield database_1.client.connect();
            const userID = req.body.userID;
            const data = req.body;
            // Data Validation
            const schema = {
                userID: "",
                name: "",
                caloriesLimit: 0,
                proteinLimit: 0,
                carbsLimit: 0,
                fatsLimit: 0,
                breakfastCaloriesLimit: 0,
                lunchCaloriesLimit: 0,
                snacksCaloriesLimit: 0,
                dinnerCaloriesLimit: 0,
            };
            if (!(0, utils_1.validateData)(req, res, data, schema)) {
                return;
            }
            (0, utils_1.routeLog)(req, `Updating User Data: ${userID}`);
            // Remove data that doesn't need to be updated
            delete data.userID;
            Object.keys(data).forEach((key) => {
                // Remove empty strings and -1 values
                if (typeof data[key] === "string") {
                    if (data[key].length === 0) {
                        delete data[key];
                    }
                }
                else if (typeof data[key] === "number") {
                    if (data[key] === -1) {
                        delete data[key];
                    }
                }
            });
            // Update user data
            yield database_1.client.db("CalPal").collection("userData").updateOne({ userID: userID }, { $set: data });
            (0, utils_1.routeLog)(req, `User Data Updated: ${userID}`);
            res.status(200).send('User data updated.');
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
