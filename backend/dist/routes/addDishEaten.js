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
exports.addDishEaten = addDishEaten;
const database_1 = require("../database");
const utils_1 = require("../utils");
function addDishEaten(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield database_1.client.connect();
            const data = req.body;
            // Data Validation
            const schema = {
                userID: "",
                mealType: "",
                dishID: "",
                date: "",
                grams: 0,
                quantity: 0,
                foodServing: [0]
            };
            if (!(0, utils_1.validateData)(req, res, data, schema)) {
                return;
            }
            (0, utils_1.routeLog)(req, `Adding Dish Eaten: ${req.body.userID}`);
            const result = yield database_1.client.db("CalPal").collection("dishEaten").insertOne(data);
            if (!result.insertedId) {
                throw new Error("Failed to insert dish eaten.");
            }
            (0, utils_1.routeLog)(req, `Dish Eaten added: ${result.insertedId}`);
            res.status(200).send(result.insertedId);
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
