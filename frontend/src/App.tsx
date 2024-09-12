import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Container } from '@mui/material';

import { Dashboard } from './routes/Dashboard';
import { Login } from './routes/Login';
import AddFoodDish from './routes/AddFoodDish';
import CreateFoodDish from './routes/CreateFoodDish';

import { DetailedDishEatenInterface, DetailedFoodEatenInterface, DishFoodInterface, DishInterface, FoodInterface, MealsDishEatenInterface, MealsFoodEatenInterface, TotalMacrosInterface, UserDataInterface } from './Interface';
import axios from 'axios';
import { UserDataSettings } from './routes/UserDataSettings';
import EditFoodDish from './routes/EditFoodDish';
import { ShowFoodDishEaten } from './routes/ShowFoodDishEaten';
import EditFoodDishEaten from './routes/EditFoodDishEaten';
import { Register } from './routes/Register';
import { ChangePassword } from './routes/ChangePassword';

export function App() {
    const navigate = useNavigate()
    
    const [isDataPresent, setIsDataPresent]: [boolean, Function] = useState(false)
    const [userData, setUserData]: [UserDataInterface, Function] = useState({ 
        name: '',
        caloriesLimit: 0, carbsLimit: 0, proteinLimit: 0, fatsLimit: 0, 
        breakfastCaloriesLimit: 0, lunchCaloriesLimit: 0, snacksCaloriesLimit: 0, dinnerCaloriesLimit: 0 
    })
    const [mealType, setMealType]: [string, Function] = useState('Breakfast')
    const [foods, setFoods]: [FoodInterface[], Function] = useState([])
    const [dishes, setDishes]: [DishInterface[], Function] = useState([])
    const [mealsFoodEaten, setMealsFoodEaten]: [MealsFoodEatenInterface, Function] = useState({ 
        breakfast: [], lunch: [], snacks: [], dinner: [] 
    })
    const [mealsDishEaten, setMealsDishEaten]: [MealsDishEatenInterface, Function] = useState({
        breakfast: [], lunch: [], snacks: [], dinner: []
    })
    const [totalMacros, setTotalMacros]: [TotalMacrosInterface, Function] = useState({ 
        calories: 0, carbs: 0, protein: 0, fats: 0 
    })
    const [foodDishEatenEditing, setFoodDishEatenEditing]: [{foodDishEatenEditingID: string, isDish: boolean}, Function] = useState({
        foodDishEatenEditingID: '', isDish: false
    })

    async function getAndHandleUserData() {
        try {
            const res = await axios.get('/api/getUserData')

            const foods: FoodInterface[] = res.data.foods
            const dishes: DishInterface[] = res.data.dishes
            let foodEaten: DetailedFoodEatenInterface[] = res.data.foodEaten
            let dishEaten: DetailedDishEatenInterface[] = res.data.dishEaten

            const totalMacrosTemp = {
                calories: 0,
                carbs: 0,
                protein: 0,
                fats: 0
            }

            // Transform food eaten to include food macros details
            foodEaten = foodEaten.map((item: DetailedFoodEatenInterface) => {
                const food = foods.find((food: FoodInterface) => food.name === item.food)

                if (!food) throw new Error('Food not found')

                item.calories = food.calories
                item.carbs = food.carbs
                item.protein = food.protein
                item.fats = food.fats

                // Add to total macros
                totalMacrosTemp.calories += item.calories * item.grams * item.quantity
                totalMacrosTemp.carbs += item.carbs * item.grams * item.quantity
                totalMacrosTemp.protein += item.protein * item.grams * item.quantity
                totalMacrosTemp.fats += item.fats * item.grams * item.quantity

                return item
            })

            // Group food eaten by meal type
            const foodEatenBreakfast = foodEaten.filter((item: DetailedFoodEatenInterface) => item.mealType === "Breakfast")
            const foodEatenLunch = foodEaten.filter((item: DetailedFoodEatenInterface) => item.mealType === "Lunch")
            const foodEatenSnacks = foodEaten.filter((item: DetailedFoodEatenInterface) => item.mealType === "Snacks")
            const foodEatenDinner = foodEaten.filter((item: DetailedFoodEatenInterface) => item.mealType === "Dinner")

            // Transform dish eaten to include food macros details
            dishEaten = dishEaten.map((dishEatenItem: DetailedDishEatenInterface) => {
                const dish = dishes.find((dishItem: DishInterface) => dishItem.name === dishEatenItem.dish)

                if (!dish) throw new Error('Dish not found')

                const dishEatenItemTotalServing = dishEatenItem.foodServing.reduce((acc: number, serving: number) => {return acc + serving}, 0)

                dishEatenItem.calories = 0
                dishEatenItem.carbs = 0
                dishEatenItem.protein = 0
                dishEatenItem.fats = 0

                dish.foods.forEach((dishFood: DishFoodInterface, index: number) => {
                    const food = foods.find((food: FoodInterface) => food.name === dishFood.food)

                    if (!food) throw new Error('Food not found')

                    dishEatenItem.calories += food.calories * (dishEatenItem.foodServing[index] / dishEatenItemTotalServing)
                    dishEatenItem.carbs += food.carbs * (dishEatenItem.foodServing[index] / dishEatenItemTotalServing)
                    dishEatenItem.protein += food.protein * (dishEatenItem.foodServing[index] / dishEatenItemTotalServing)
                    dishEatenItem.fats += food.fats * (dishEatenItem.foodServing[index] / dishEatenItemTotalServing)
                })

                // Add to total macros
                totalMacrosTemp.calories += dishEatenItem.calories * dishEatenItem.grams * dishEatenItem.quantity
                totalMacrosTemp.carbs += dishEatenItem.carbs * dishEatenItem.grams * dishEatenItem.quantity
                totalMacrosTemp.protein += dishEatenItem.protein * dishEatenItem.grams * dishEatenItem.quantity
                totalMacrosTemp.fats += dishEatenItem.fats * dishEatenItem.grams * dishEatenItem.quantity

                return dishEatenItem
            })

            // Group dish eaten by meal type
            const dishEatenBreakfast = dishEaten.filter((item: DetailedDishEatenInterface) => item.mealType === "Breakfast")
            const dishEatenLunch = dishEaten.filter((item: DetailedDishEatenInterface) => item.mealType === "Lunch")
            const dishEatenSnacks = dishEaten.filter((item: DetailedDishEatenInterface) => item.mealType === "Snacks")
            const dishEatenDinner = dishEaten.filter((item: DetailedDishEatenInterface) => item.mealType === "Dinner")

            setUserData(res.data.userData)
            setFoods(res.data.foods)
            setDishes(res.data.dishes)
            setMealsFoodEaten({ 
                breakfast: foodEatenBreakfast, 
                lunch: foodEatenLunch, 
                snacks: foodEatenSnacks, 
                dinner: foodEatenDinner 
            })
            setMealsDishEaten({ 
                breakfast: dishEatenBreakfast,
                lunch: dishEatenLunch, 
                snacks: dishEatenSnacks, 
                dinner: dishEatenDinner })
            setTotalMacros(totalMacrosTemp) 
            setIsDataPresent(true)
        } catch (error) {
            console.log(error)
            navigate('/login')
        }
    }
    
    return (
        <Container
            maxWidth={'md'}
        >
            <Routes>
                <Route 
                    path={'/login'} 
                    element={
                        <Login />
                    } 
                />
                <Route 
                    path={'/register'} 
                    element={
                        <Register />
                    } 
                />
                <Route 
                    path={'/dashboard'} 
                    element={
                        <Dashboard 
                            isDataPresent={isDataPresent}
                            getAndHandleUserData={getAndHandleUserData}
                            userData={userData} 
                            setMealType={setMealType}
                            mealsFoodEaten={mealsFoodEaten}
                            mealsDishEaten={mealsDishEaten}
                            totalMacros={totalMacros}
                        />
                    } 
                />
                <Route 
                    path={'/addFood'} 
                    element={
                        <AddFoodDish
                            isDataPresent={isDataPresent}
                            getAndHandleUserData={getAndHandleUserData}
                            userData={userData} 
                            mealType={mealType}
                            foods={foods}
                            dishes={dishes}
                            mealsFoodEaten={mealsFoodEaten}
                            mealsDishEaten={mealsDishEaten}
                            totalMacros={totalMacros}
                        />
                    } 
                />
                <Route 
                    path={'/createFood'} 
                    element={
                        <CreateFoodDish
                            userName={userData.name}
                            isDataPresent={isDataPresent}
                            getAndHandleUserData={getAndHandleUserData}
                            foods={foods} 
                        />
                    } 
                />
                <Route
                    path={'/editFood'}
                    element={
                        <EditFoodDish
                            userName={userData.name}
                            isDataPresent={isDataPresent}
                            getAndHandleUserData={getAndHandleUserData}
                            foods={foods}
                            dishes={dishes}
                        />
                    }
                />
                <Route
                    path={'/showFoodEaten'}
                    element={
                        <ShowFoodDishEaten 
                            userName={userData.name}
                            isDataPresent={isDataPresent}
                            foodEaten={mealsFoodEaten.breakfast.concat(mealsFoodEaten.lunch, mealsFoodEaten.snacks, mealsFoodEaten.dinner)}
                            dishEaten={mealsDishEaten.breakfast.concat(mealsDishEaten.lunch, mealsDishEaten.snacks, mealsDishEaten.dinner)}
                            setFoodDishEatenEditing={(foodDishEatenEditingID: string, isDish: boolean) => setFoodDishEatenEditing({foodDishEatenEditingID, isDish})}
                        />
                    }
                />
                <Route
                    path={'/editFoodEaten'}
                    element={
                        <EditFoodDishEaten 
                        userName={userData.name}
                        isDataPresent={isDataPresent}
                        getAndHandleUserData={getAndHandleUserData}
                        foodDishEatenEditing={foodDishEatenEditing}
                        foods={foods}
                        dishes={dishes}
                        foodEaten={mealsFoodEaten.breakfast.concat(mealsFoodEaten.lunch, mealsFoodEaten.snacks, mealsFoodEaten.dinner)}
                        dishEaten={mealsDishEaten.breakfast.concat(mealsDishEaten.lunch, mealsDishEaten.snacks, mealsDishEaten.dinner)}
                        />
                    }
                />
                <Route
                    path={'/userSettings'}
                    element={
                        <UserDataSettings 
                            isDataPresent={isDataPresent}
                            getAndHandleUserData={getAndHandleUserData}
                            userData={userData}
                        />
                    }
                />
                <Route
                    path={'/changePassword'}
                    element={
                        <ChangePassword 
                            isDataPresent={isDataPresent}
                            userName={userData.name}
                        />
                    }
                />
                <Route 
                    path={'*'} 
                    element={<Navigate to={'/dashboard'} />} 
                />
            </Routes>
        </Container>
    )
}