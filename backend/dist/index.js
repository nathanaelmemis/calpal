"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookieParser = require("cookie-parser");
const cookieJwtAuth_1 = require("./middleware/cookieJwtAuth");
const login_1 = require("./routes/login");
const authenticate_1 = require("./routes/authenticate");
const getUserData_1 = require("./routes/getUserData");
const addFoodEaten_1 = require("./routes/addFoodEaten");
const createFood_1 = require("./routes/createFood");
const createDish_1 = require("./routes/createDish");
const addDishEaten_1 = require("./routes/addDishEaten");
const updateUserData_1 = require("./routes/updateUserData");
const updateFood_1 = require("./routes/updateFood");
const updateDish_1 = require("./routes/updateDish");
const updateDishEaten_1 = require("./routes/updateDishEaten");
const updateFoodEaten_1 = require("./routes/updateFoodEaten");
const deleteFoodDishEaten_1 = require("./routes/deleteFoodDishEaten");
const register_1 = require("./routes/register");
const logout_1 = require("./routes/logout");
const changePassword_1 = require("./routes/changePassword");
const deleteFoodDish_1 = require("./routes/deleteFoodDish");
const deleteAccount_1 = require("./routes/deleteAccount");
const getSalt_1 = require("./routes/getSalt");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(cookieParser());
const port = process.env.PORT || 3000;
// Routes
app.post("/authenticate", cookieJwtAuth_1.cookieJwtAuth, authenticate_1.authenticate);
app.post("/login", login_1.login);
app.post("/register", register_1.register);
app.get('/getSalt', getSalt_1.getSalt);
app.get('/getUserData', cookieJwtAuth_1.cookieJwtAuth, getUserData_1.getUserData);
app.post("/logout", logout_1.logout);
app.post("/changePassword", cookieJwtAuth_1.cookieJwtAuth, changePassword_1.changePassword);
app.post("/updateUserData", cookieJwtAuth_1.cookieJwtAuth, updateUserData_1.updateUserData);
app.post('/addFoodEaten', cookieJwtAuth_1.cookieJwtAuth, addFoodEaten_1.addFoodEaten);
app.post('/addDishEaten', cookieJwtAuth_1.cookieJwtAuth, addDishEaten_1.addDishEaten);
app.post('/createFood', cookieJwtAuth_1.cookieJwtAuth, createFood_1.createFood);
app.post('/createDish', cookieJwtAuth_1.cookieJwtAuth, createDish_1.createDish);
app.post('/updateFood', cookieJwtAuth_1.cookieJwtAuth, updateFood_1.updateFood);
app.post('/updateDish', cookieJwtAuth_1.cookieJwtAuth, updateDish_1.updateDish);
app.put('/updateFoodEaten', cookieJwtAuth_1.cookieJwtAuth, updateFoodEaten_1.updateFoodEaten);
app.put('/updateDishEaten', cookieJwtAuth_1.cookieJwtAuth, updateDishEaten_1.updateDishEaten);
app.delete('/deleteAccount', cookieJwtAuth_1.cookieJwtAuth, deleteAccount_1.deleteAccount);
app.delete('/deleteFoodDish', cookieJwtAuth_1.cookieJwtAuth, deleteFoodDish_1.deleteFoodDish);
app.delete('/deleteFoodDishEaten', cookieJwtAuth_1.cookieJwtAuth, deleteFoodDishEaten_1.deleteFoodDishEaten);
// Easter eggs
app.get('/ping', (req, res) => {
    res.send("pong 🏓");
});
// Route not found
app.use((req, res, next) => {
    res.status(404).send("Are you trying to DOS me? Please don't. 🥺👉👈");
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
module.exports = app;
