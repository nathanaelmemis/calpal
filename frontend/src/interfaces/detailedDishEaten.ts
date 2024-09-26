import { DishEaten } from "./dishEaten"

export interface DetailedDishEaten extends DishEaten {
    calories: number
    carbs: number
    protein: number
    fats: number
}