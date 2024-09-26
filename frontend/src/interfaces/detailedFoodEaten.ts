import { FoodEaten } from "./foodEaten"

export interface DetailedFoodEaten extends FoodEaten {
    calories: number
    carbs: number
    protein: number
    fats: number
}