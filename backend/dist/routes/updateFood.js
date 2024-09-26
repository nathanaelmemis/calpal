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
exports.updateFood = updateFood;
const mongodb_1 = require("mongodb");
const database_1 = require("../database");
const utils_1 = require("../utils");
function updateFood(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield database_1.client.connect();
            const data = req.body;
            const userID = data.userID;
            const foodID = data.foodID;
            // Data Validation
            const schema = {
                foodID: "",
                userID: "",
                name: "",
                defaultServing: 0,
                calories: 0,
                protein: 0,
                carbs: 0,
                fats: 0
            };
            if (!(0, utils_1.validateData)(req, res, data, schema)) {
                return;
            }
            (0, utils_1.routeLog)(req, `Updating Food: ${userID} ${foodID}`);
            // Retrieve food & dish data
            const duplicateFood = yield database_1.client.db("CalPal").collection("foods").find({ userID: userID, name: data.name }).toArray();
            const duplicateDish = yield database_1.client.db("CalPal").collection("dish").find({ userID: userID, name: data.name }).toArray();
            // Check if dish in foods or dish already exists
            if (duplicateFood.length > 0 || duplicateDish.length > 0) {
                (0, utils_1.routeLog)(req, "Food already exists.");
                res.status(400).send("Food already exists.");
                return;
            }
            // Remove data that doesn't need to be updated
            delete data.foodID;
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
            // Update food
            yield database_1.client.db("CalPal").collection("foods").updateOne({ _id: new mongodb_1.ObjectId(foodID), userID: userID }, { $set: data });
            (0, utils_1.routeLog)(req, `Food Updated: ${userID} ${foodID}`);
            res.status(200).send('Food updated.');
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
