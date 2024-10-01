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
exports.deleteAccount = deleteAccount;
const database_1 = require("../database");
const mongodb_1 = require("mongodb");
const utils_1 = require("../utils");
function deleteAccount(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield database_1.client.connect();
            const data = req.body;
            const userID = data.userID;
            // Data Validation
            const schema = {
                userID: "",
                email: "",
                hash: "",
            };
            if (!(0, utils_1.validateData)(req, res, data, schema)) {
                return;
            }
            (0, utils_1.routeLog)(req, `Deleting Account: ${userID}`);
            const user = yield database_1.client.db("CalPal").collection("users").findOne({ email: data.email, hash: data.hash });
            if (!user) {
                (0, utils_1.routeLog)(req, `Invalid Credentials: ${data.email}`);
                res.status(404).send("Invalid Credentials.");
                return;
            }
            // Delete user data from users collection
            const deleteOnUsersResult = yield database_1.client.db("CalPal").collection("users").deleteOne({
                _id: new mongodb_1.ObjectId(userID),
            });
            // Delete user data from userData collection
            const deleteOnUserDataResult = yield database_1.client.db("CalPal").collection("userData").deleteOne({
                userID: userID
            });
            // Delete user data from foods collection
            const deleteOnFoodsResult = yield database_1.client.db("CalPal").collection("foods").deleteMany({
                userID: userID
            });
            // Delete user data from dishes collection
            const deleteOnDishesResult = yield database_1.client.db("CalPal").collection("dishes").deleteMany({
                userID: userID
            });
            // Delete user data from foodEaten collection
            const deleteOnFoodEatenResult = yield database_1.client.db("CalPal").collection("foodEaten").deleteMany({
                userID: userID
            });
            // Delete user data from dishEaten collection
            const deleteOnDishEatenResult = yield database_1.client.db("CalPal").collection("dishEaten").deleteMany({
                userID: userID
            });
            // Check if any data was deleted
            if (!deleteOnUsersResult.deletedCount || !deleteOnUserDataResult.deletedCount) {
                throw new Error(`Failed To Delete Account: ${userID}`);
            }
            (0, utils_1.routeLog)(req, `Account Deleted: ${userID} ${deleteOnUsersResult.deletedCount} ${deleteOnUserDataResult.deletedCount} ${deleteOnFoodsResult.deletedCount} ${deleteOnDishesResult.deletedCount} ${deleteOnFoodEatenResult.deletedCount} ${deleteOnDishEatenResult.deletedCount}`);
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
