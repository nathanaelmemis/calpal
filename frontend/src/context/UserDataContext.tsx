import { createContext, Dispatch, SetStateAction } from "react";
import { Food } from "../interfaces/food";
import { Dish } from "../interfaces/dish";
import { UserData } from "../interfaces/userData";
import { Meal } from "../interfaces/meal";
import { FoodDishEatenEditing } from "../interfaces/foodDishEatenEditing";
import { FoodEaten } from "../interfaces/foodEaten";
import { DishEaten } from "../interfaces/dishEaten";

interface UserDataContextProps { 
    isFetchingData: boolean
    userData: UserData
    foods: Food[]
    dishes: Dish[]
    foodEaten: FoodEaten[]
    dishEaten: DishEaten[]
    getData: (collectionsToRetrieve: ('userData' | 'foods' | 'dishes' | 'foodEaten' | 'dishEaten')[]) => Promise<void>
    mealType: Meal
    setMealType: Dispatch<SetStateAction<Meal>>
    foodDishEatenEditing: FoodDishEatenEditing
    setFoodDishEatenEditing: Dispatch<SetStateAction<FoodDishEatenEditing>>
}

export const UserDataContext = createContext<UserDataContextProps>({
    isFetchingData: false,
    userData: {
        name: '',
        caloriesLimit: 0,
        carbsLimit: 0,
        proteinLimit: 0,
        fatsLimit: 0,
        breakfastCaloriesLimit: 0,
        lunchCaloriesLimit: 0,
        snacksCaloriesLimit: 0,
        dinnerCaloriesLimit: 0
    },
    foods: [],
    dishes: [],
    foodEaten: [],
    dishEaten: [],
    getData: async () => {},
    mealType: 'breakfast',
    setMealType: () => {},
    foodDishEatenEditing: {
        foodDishEatenEditingID: '',
        isDish: false
    },
    setFoodDishEatenEditing: () => {}
});