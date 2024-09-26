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
exports.createDish = createDish;
const database_1 = require("../database");
const utils = require("../utils.ts");
const assert = require('assert');
function createDish(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield database_1.client.connect();
            const userID = req.body.userID;
            const data = req.body;
            // Data Validation
            const schema = {
                userID: "",
                name: "",
                defaultServing: 0,
                foods: [
                    {
                        foodID: "",
                        defaultServing: 0
                    },
                ]
            };
            if (!utils.validateData(req, res, data, schema)) {
                return;
            }
            utils.routeLog(req, `Creating Dish: ${userID} ${data.name}`);
            // Retrieve food & dish data
            const duplicateFood = yield database_1.client.db("CalPal").collection("foods").find({ userID: userID, name: data.name }).toArray();
            const duplicateDish = yield database_1.client.db("CalPal").collection("dishes").find({ userID: userID, name: data.name }).toArray();
            // Check if dish in foods or dish already exists
            if (duplicateFood.length > 0 || duplicateDish.length > 0) {
                utils.routeLog(req, "Dish already exists.");
                res.status(400).send("Dish already exists.");
                return;
            }
            // Insert dish data
            const result = yield database_1.client.db("CalPal").collection("dishes").insertOne(data);
            // Check if dish was inserted
            if (!result.insertedId) {
                throw new Error("Failed to create dish.");
            }
            utils.routeLog(req, `Dish Created: ${req.body.userID} ${result.insertedId}`);
            res.status(200).send(result.insertedId);
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
