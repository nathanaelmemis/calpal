"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const utils = require("../utils.ts");
function authenticate(req, res) {
    utils.routeLog(req, `User Authenticated: ${req.body.userID}`);
    res.status(200).send("User Authenticated.");
}
