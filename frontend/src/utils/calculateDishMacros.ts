import { Macros } from "../interfaces/macros"
import { Food } from "../interfaces/food"
import { Dish } from "../interfaces/dish"

/**
 * @param dishID 
 * @param foodServing used when calculating macros for dish eaten
 * @param quantity used when calculating macros for dish eaten
 * @returns macros with 0 values if error occurs
 */
export function calculateDishMacros(
    foods: Food[], 
    dishes: Dish[], 
    dishID: string, 
    foodServing: number[] | false = false, 
    grams: number,
    quantity: number
): Macros {
    try {
        const dish = dishes.find(dishItem => dishItem._id === dishID)

        if (!dish) {
            throw new Error(`Dish not found: ${dishID}`)
        }

        const dishMacros = dish.foods.reduce<Macros>((acc, dishFoodItem, index) => {
            const food = foods.find(food => food._id === dishFoodItem.foodID)
            
            if (!food) {
                throw new Error(`Food not found: ${dishFoodItem}`) 
            }
    
            // when no foodServing is given calculate using defaultServing of dishFood
            acc.calories += food.calories * (foodServing ? foodServing[index] : dish.foods[index].defaultServing)
            acc.carbs += food.carbs * (foodServing ? foodServing[index] : dish.foods[index].defaultServing)
            acc.protein += food.protein * (foodServing ? foodServing[index] : dish.foods[index].defaultServing)
            acc.fats += food.fats * (foodServing ? foodServing[index] : dish.foods[index].defaultServing)
    
            return acc
        }, {
            calories: 0,
            carbs: 0,
            protein: 0,
            fats: 0
        })

        // when no foodServing is given calculate using defaultServing of dishFood
        const dishEatenTotalFoodServing = 
            (foodServing 
                ? foodServing
                : dish.foods.map((dishFood) => dishFood.defaultServing))
                    .reduce((acc, item) => acc + item, 0)
        
        if (dishEatenTotalFoodServing === 0) {
            return {
                calories: 0,
                carbs: 0,
                protein: 0,
                fats: 0
            }
        }

        dishMacros.calories = (dishMacros.calories / dishEatenTotalFoodServing) * grams * quantity
        dishMacros.carbs = (dishMacros.carbs / dishEatenTotalFoodServing) * grams * quantity
        dishMacros.protein = (dishMacros.protein / dishEatenTotalFoodServing) * grams * quantity
        dishMacros.fats = (dishMacros.fats / dishEatenTotalFoodServing) * grams * quantity
        
        return dishMacros
    } catch (error) {
        console.error(error)
        return {
            calories: 0,
            carbs: 0,
            protein: 0,
            fats: 0
        }
    }
}