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
exports.updateFoodEaten = updateFoodEaten;
const database_1 = require("../database");
const mongodb_1 = require("mongodb");
const utils = require("../utils.ts");
function updateFoodEaten(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield database_1.client.connect();
            const data = req.body;
            const userID = data.userID;
            const foodEatenID = data.foodEatenID;
            // Data Validation
            // Don't include date since it's not being updated
            const schema = {
                userID: "",
                foodEatenID: "",
                mealType: "",
                foodID: "",
                grams: 0,
                quantity: 0,
            };
            if (!utils.validateData(req, res, data, schema)) {
                return;
            }
            utils.routeLog(req, `Updating Food Eaten: ${userID} ${foodEatenID}`);
            // Remove data that doesn't need to be updated
            delete data.foodEatenID;
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
            const result = yield database_1.client.db("CalPal").collection("foodEaten").updateOne({ _id: new mongodb_1.ObjectId(foodEatenID), userID: userID }, { $set: data });
            if (!result.matchedCount) {
                throw new Error("Failed to update food eaten.");
            }
            utils.routeLog(req, `Food Eaten Updated: ${userID} ${foodEatenID}`);
            res.status(200).send(`Food Eaten Updated`);
        }
        catch (error) {
            utils.routeLog(req, error.message);
            res.status(500).send(error);
        }
        finally {
            yield database_1.client.close();
        }
    });
}
