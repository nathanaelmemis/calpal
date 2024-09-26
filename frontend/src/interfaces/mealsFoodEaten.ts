import { DetailedFoodEaten } from "./detailedFoodEaten";
import { Meal } from "./meal";

export type MealsFoodEaten = {
    [key in Meal]: DetailedFoodEaten[]
}