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
exports.getSalt = getSalt;
const database_1 = require("../database");
const jwt = require("jsonwebtoken");
const utils_1 = require("../utils");
function getSalt(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield database_1.client.connect();
            const data = req.query;
            // Data Validation  
            const schema = {
                email: ""
            };
            if (!(0, utils_1.validateData)(req, res, data, schema)) {
                return;
            }
            const user = yield database_1.client.db("CalPal").collection("users").findOne({ email: data.email });
            if (!user) {
                (0, utils_1.routeLog)(req, `Invalid Credentials: ${data.email}`);
                res.status(404).send("Invalid Credentials.");
                return;
            }
            (0, utils_1.routeLog)(req, `Salt Retrieved: ${user.email}`);
            res.status(200).send({ salt: user.salt });
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
