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
exports.getUserData = getUserData;
const moment_1 = __importDefault(require("moment"));
const database_1 = require("../database");
const utils_1 = require("../utils");
// Valid collections to retrieve
// Users collection should not be included because it contains login credentials
const USER_DATA_COLLECTIONS = ['userData', 'foods', 'dishes', 'foodEaten', 'dishEaten'];
function getUserData(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield database_1.client.connect();
            const userID = req.body.userID;
            const collectionsToRetrieve = req.query.collectionsToRetrieve;
            const data = {
                collectionsToRetrieve: collectionsToRetrieve,
                userID: userID
            };
            const collectinsToRetrieveScheme = ['userData'];
            const schema = {
                collectionsToRetrieve: collectinsToRetrieveScheme,
                userID: ''
            };
            if (!(0, utils_1.validateData)(req, res, data, schema)) {
                return;
            }
            (0, utils_1.routeLog)(req, `Getting Collections: ${userID}`);
            const retrievedCollections = {};
            for (const collection of data.collectionsToRetrieve) {
                if (!USER_DATA_COLLECTIONS.includes(collection)) {
                    (0, utils_1.routeLog)(req, `Invalid Collection: ${collection}`);
                    res.status(400).send(`Invalid Collection: ${collection}`);
                    return;
                }
                // Retrieve user data
                const query = {
                    userID: userID,
                    date: { $gte: (0, moment_1.default)().startOf('day').toDate() }
                };
                if (collection !== 'foodEaten' && collection !== 'dishEaten') {
                    delete query.date;
                }
                let result = null;
                if (collection === 'userData') {
                    result = yield database_1.client.db("CalPal").collection(collection).findOne(query);
                }
                else {
                    result = yield database_1.client.db("CalPal").collection(collection).find(query).toArray();
                }
                if (result) {
                    retrievedCollections[collection] = result;
                }
            }
            (0, utils_1.routeLog)(req, `Collections Found: ${userID}`);
            res.status(200).send(retrievedCollections);
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
