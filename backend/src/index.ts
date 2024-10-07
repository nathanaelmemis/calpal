import express, { Express } from "express";
const cookieParser = require("cookie-parser");

import { cookieJwtAuth } from "./middleware/cookieJwtAuth";
import { login } from "./routes/login";
import { authenticate } from "./routes/authenticate";
import { getUserData } from "./routes/getUserData";
import { addFoodEaten } from "./routes/addFoodEaten";
import { createFood } from "./routes/createFood";
import { createDish } from "./routes/createDish";
import { addDishEaten } from "./routes/addDishEaten";
import { updateUserData } from "./routes/updateUserData";
import { updateFood } from "./routes/updateFood";
import { updateDish } from "./routes/updateDish";
import { updateDishEaten } from "./routes/updateDishEaten";
import { updateFoodEaten } from "./routes/updateFoodEaten";
import { deleteFoodDishEaten } from "./routes/deleteFoodDishEaten";
import { register } from "./routes/register";
import { logout } from "./routes/logout";
import { changePassword } from "./routes/changePassword";
import { deleteFoodDish } from "./routes/deleteFoodDish";
import { deleteAccount } from "./routes/deleteAccount";
import { getSalt } from "./routes/getSalt";

const app: Express = express();
app.use(express.json());
app.use(cookieParser());
const port = process.env.PORT || 3000;

// Routes
app.post("/authenticate", cookieJwtAuth, authenticate)
app.post("/login", login)
app.post("/register", register)

app.get('/getSalt', getSalt)
app.get('/getUserData', cookieJwtAuth, getUserData)

app.post("/logout", logout)
app.post("/changePassword", cookieJwtAuth, changePassword)
app.post("/updateUserData", cookieJwtAuth, updateUserData)

app.post('/addFoodEaten', cookieJwtAuth, addFoodEaten)
app.post('/addDishEaten', cookieJwtAuth, addDishEaten)

app.post('/createFood', cookieJwtAuth, createFood)
app.post('/createDish', cookieJwtAuth, createDish)

app.post('/updateFood', cookieJwtAuth, updateFood)
app.post('/updateDish', cookieJwtAuth, updateDish)

app.put('/updateFoodEaten', cookieJwtAuth, updateFoodEaten)
app.put('/updateDishEaten', cookieJwtAuth, updateDishEaten)

app.delete('/deleteAccount', cookieJwtAuth, deleteAccount)
app.delete('/deleteFoodDish', cookieJwtAuth, deleteFoodDish)
app.delete('/deleteFoodDishEaten', cookieJwtAuth, deleteFoodDishEaten)

// Easter eggs
app.get('/ping', (req, res) => {
    res.send("pong 🏓")
})

// Route not found
app.use((req, res, next) => { 
    res.status(404).send( 
        "Are you trying to DOS me? Please don't. 🥺👉👈") 
}) 

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

module.exports = app;