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
exports.deleteFoodDishEaten = deleteFoodDishEaten;
const database_1 = require("../database");
const mongodb_1 = require("mongodb");
const utils = require("../utils.ts");
function deleteFoodDishEaten(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield database_1.client.connect();
            const data = req.body;
            const userID = data.userID;
            const foodDishEatenID = data.foodDishEatenID;
            // Data Validation
            const schema = {
                userID: "",
                foodDishEatenID: "",
                isDish: true,
            };
            if (!utils.validateData(req, res, data, schema)) {
                return;
            }
            utils.routeLog(req, `Deleting Food/Dish Eaten: ${userID} ${foodDishEatenID}`);
            let result = null;
            if (data.isDish) {
                result = yield database_1.client.db("CalPal").collection("dishEaten").deleteOne({
                    _id: new mongodb_1.ObjectId(foodDishEatenID),
                    userID: userID
                });
            }
            else {
                result = yield database_1.client.db("CalPal").collection("foodEaten").deleteOne({
                    _id: new mongodb_1.ObjectId(foodDishEatenID),
                    userID: userID
                });
            }
            if (!result.deletedCount) {
                throw new Error(`Failed To Delete Food/Dish Eaten: ${userID} ${foodDishEatenID}`);
            }
            utils.routeLog(req, `Food/Dish Eaten deleted: ${userID} ${foodDishEatenID}`);
            res.status(200).send(result.deletedCount);
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
