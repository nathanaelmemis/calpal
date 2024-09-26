"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const utils_1 = require("../utils");
function authenticate(req, res) {
    (0, utils_1.routeLog)(req, `User Authenticated: ${req.body.userID}`);
    res.status(200).send("User Authenticated.");
}
