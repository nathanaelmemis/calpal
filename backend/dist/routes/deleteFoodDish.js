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
exports.deleteFoodDish = deleteFoodDish;
const database_1 = require("../database");
const mongodb_1 = require("mongodb");
const utils_1 = require("../utils");
function deleteFoodDish(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield database_1.client.connect();
            const data = req.body;
            const userID = data.userID;
            const foodDishID = data.foodDishID;
            // Data Validation
            const schema = {
                userID: "",
                foodDishID: "",
                isDish: true,
            };
            if (!(0, utils_1.validateData)(req, res, data, schema)) {
                return;
            }
            (0, utils_1.routeLog)(req, `Deleting Food/Dish: ${userID} ${foodDishID}`);
            let result = null;
            if (data.isDish) {
                result = yield database_1.client.db("CalPal").collection("dishes").deleteOne({
                    _id: new mongodb_1.ObjectId(foodDishID),
                    userID: userID
                });
            }
            else {
                /**
                 * This solution doesn't support atomic transactions, so if one of the updates fails, the database will be in an inconsistent state.
                 * If another user tries to read or delete during this transaction, they may get an inconsistent result.
                 */
                // get all dishes that contain the foodID
                const dishesToUpdate = yield database_1.client
                    .db("CalPal").collection("dishes")
                    .find({
                    userID: userID,
                    'foods.foodID': foodDishID
                }).toArray();
                // get the indices of the dishes.foods that contain the food
                const dishesToUpdateData = dishesToUpdate.map((dish) => {
                    const foodIndex = dish.foods.findIndex((dishFood) => dishFood.foodID === foodDishID);
                    return {
                        updateMany: {
                            'filter': { userID: userID, dishID: dish._id.toString() },
                            /**
                             * this slices the array into 2 parts, the first part is the array from 0 to foodIndex
                             * the second part is the array from foodIndex + 1 to the end of the array
                             * then it concatenates the 2 arrays together essentially removing the foodServing from the array
                             */
                            'update': {
                                $set: { foodServing: {
                                        $concatArrays: [
                                            { $slice: ["$foodServing", foodIndex] },
                                            { $slice: ["$foodServing", { $add: [1, foodIndex] }, { $size: "$foodServing" }] }
                                        ]
                                    } }
                            },
                        }
                    };
                });
                // update all dishes that contain the food
                const dishesUpdateResult = yield database_1.client.db("CalPal").collection("dishes").updateMany({ userID: userID }, { $pull: { foods: { foodID: foodDishID } } });
                (0, utils_1.routeLog)(req, `Dishes Updated: ${dishesUpdateResult.modifiedCount}`);
                // update all dishEaten that contain the food using the indices
                if (dishesToUpdateData.length > 0) {
                    const dishEatenUpdateResult = yield database_1.client.db("CalPal").collection("dishEaten").bulkWrite(dishesToUpdateData);
                    (0, utils_1.routeLog)(req, `Dish Eaten Updated: ${dishEatenUpdateResult.modifiedCount}`);
                }
                // delete food from foodEaten
                const foodEatenUpdateResult = yield database_1.client.db("CalPal").collection("foodEaten").deleteMany({
                    foodID: foodDishID,
                    userID: userID
                });
                (0, utils_1.routeLog)(req, `Food Eaten Deleted: ${foodEatenUpdateResult.deletedCount}`);
                // delete the food from the foods collection
                result = yield database_1.client.db("CalPal").collection("foods").deleteOne({
                    _id: new mongodb_1.ObjectId(foodDishID),
                    userID: userID
                });
                (0, utils_1.routeLog)(req, `Food Deleted: ${result.deletedCount}`);
            }
            if (!result.deletedCount) {
                throw new Error(`Failed To Delete Food/Dish Eaten: ${userID} ${foodDishID}`);
            }
            (0, utils_1.routeLog)(req, `Food/Dish Eaten deleted: ${userID} ${foodDishID}`);
            res.sendStatus(200);
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
