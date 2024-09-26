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
exports.updateDish = updateDish;
const mongodb_1 = require("mongodb");
const database_1 = require("../database");
const assert = require('assert');
const utils_1 = require("../utils");
function updateDish(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield database_1.client.connect();
            const data = req.body;
            const userID = data.userID;
            const dishID = data.dishID;
            // Data Validation  
            const schema = {
                dishID: "",
                userID: "",
                name: "",
                defaultServing: 0,
                foods: [0] // only accepts array of defaultServing because user shouldn't be able to update foodID
            };
            if (!(0, utils_1.validateData)(req, res, data, schema)) {
                return;
            }
            (0, utils_1.routeLog)(req, `Updating Dish: ${userID} ${dishID}`);
            // Retrieve food & dish data
            const duplicateFood = yield database_1.client.db("CalPal").collection("foods").find({ userID: userID, name: data.name }).toArray();
            const duplicateDish = yield database_1.client.db("CalPal").collection("dish").find({ userID: userID, name: data.name }).toArray();
            // Check if dish in foods or dish already exists
            if (duplicateFood.length > 0 || duplicateDish.length > 0) {
                (0, utils_1.routeLog)(req, "Dish already exists.");
                res.status(400).send("Dish already exists.");
                return;
            }
            // Remove data that doesn't need to be updated
            delete data.dishID;
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
            // Divide data to designated update
            const nonDishFoodData = {};
            data.name ? nonDishFoodData.name = data.name : null;
            data.defaultServing ? nonDishFoodData.defaultServing = data.defaultServing : null;
            // Create bulk write operations
            const bulkWriteOperations = [];
            if (Object.keys(nonDishFoodData).length > 0) {
                bulkWriteOperations.push({
                    updateOne: {
                        'filter': { _id: new mongodb_1.ObjectId(dishID), userID: userID },
                        'update': { $set: nonDishFoodData }
                    }
                });
            }
            const dishFoodData = data.foods;
            dishFoodData.forEach((dishFoodDefaultServing, index) => {
                bulkWriteOperations.push({
                    updateOne: {
                        'filter': { _id: new mongodb_1.ObjectId(dishID), userID: userID },
                        'update': { $set: { [`foods.${index}.defaultServing`]: dishFoodDefaultServing } }
                    }
                });
            });
            // Update dish
            const result = yield database_1.client.db("CalPal").collection("dishes").bulkWrite(bulkWriteOperations);
            if (!result.modifiedCount) {
                throw new Error(`Failed To Update Dish: ${userID} ${dishID}`);
            }
            (0, utils_1.routeLog)(req, `Dish Updated: ${userID} ${dishID}`);
            res.status(200).send('Dish updated.');
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
