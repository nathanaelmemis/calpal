interface UserDataInterface {
    [key: string]: number | string
    name: string
    caloriesLimit: number
    carbsLimit: number
    proteinLimit: number
    fatsLimit: number
    breakfastCaloriesLimit: number
    lunchCaloriesLimit: number
    snacksCaloriesLimit: number
    dinnerCaloriesLimit: number
}


interface FoodInterface {
    _id: string
    userID: string
    name: string
    defaultServing: number
    calories: number
    protein: number
    carbs: number
    fats: number
}

interface FoodEatenInterface {
    _id: string
    userID: string
    mealType: string
    date: string
    food: string
    grams: number
    quantity: number
}

interface DetailedFoodEatenInterface extends FoodEatenInterface {
    calories: number
    carbs: number
    protein: number
    fats: number
}


interface DishFoodInterface {
    food: string
    defaultServing: number
}

interface DishInterface {
    _id: string
    userID: string
    name: string
    defaultServing: number
    foods: DishFoodInterface[]
    calories: number
    protein: number
    carbs: number
    fats: number
}

interface DishEatenInterface {
    _id: string
    userID: string
    date: string
    mealType: string
    grams: number
    quantity: number
    dish: string
    foodServing: number[]
}

interface DetailedDishEatenInterface extends DishEatenInterface {
    calories: number
    carbs: number
    protein: number
    fats: number
}


interface MealsFoodEatenInterface {
    [key: string]: DetailedFoodEatenInterface[]
}

interface MealsDishEatenInterface {
    [key: string]: DetailedDishEatenInterface[]
}


interface TotalMacrosInterface {
    calories: number
    carbs: number
    protein: number
    fats: number
}

interface FoodDataInterface {
    serving: number
    defaultServing: number
    calories: number
    protein: number
    carbs: number
    fats: number
}

interface DishDataInterface {
    [key: string]: number | string
    food: string
    defaultServing: number
}

export type { 
    UserDataInterface, 
    FoodInterface, 
    FoodEatenInterface, 
    DetailedFoodEatenInterface, 
    DishFoodInterface,
    DishInterface, 
    DishEatenInterface, 
    DetailedDishEatenInterface,
    MealsFoodEatenInterface, 
    MealsDishEatenInterface,
    TotalMacrosInterface, 
    FoodDataInterface, 
    DishDataInterface 
}