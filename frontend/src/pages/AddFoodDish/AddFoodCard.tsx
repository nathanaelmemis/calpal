import { Grid, useMediaQuery, useTheme } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AddFoodDishButtons from "./AddFoodDishButtons";
import { Dispatch, SetStateAction, useState, useEffect, useContext } from "react";
import { UserDataContext } from "../../context/UserDataContext";
import AddFoodDishTextField from "./AddFoodDishTextField";
import AddFoodDishCardTitle from "./AddFoodDishCardTitle";
import { FoodEaten } from "../../interfaces/foodEaten";
import { DishEaten } from "../../interfaces/dishEaten";
import { SelectedFoodDish } from "../../interfaces/selectedFoodDish";
import { Macros } from "../../interfaces/macros";
import { calculateDishMacros } from "../../utils/calculateDishMacros";

interface AddFoodCard {
    setIsDish: Dispatch<SetStateAction<boolean>>,
    selectedFoodDish: SelectedFoodDish,
    setSelectedFoodDish: Dispatch<SetStateAction<SelectedFoodDish>>,
    setMacrosIncrease: (macros: Macros) => void
}

export function AddFoodCard({ setIsDish, selectedFoodDish, setSelectedFoodDish, setMacrosIncrease }: AddFoodCard) {
    const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'))
    const navigate = useNavigate();

    const {
        foods,
        dishes,
        foodEaten,
        dishEaten,
        getData,
        mealType
    } = useContext(UserDataContext)

    const [grams, setGrams] = useState<number>(0)
    const [quantity, setQuantity] = useState<number>(1) 

    const [mealCalories, setMealCalories] = useState<number>(0)
    const [mealCaloriesIncrease, setMealCaloriesIncrease] = useState<number>(0)

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isError, setIsError] = useState<boolean>(false)

    const [renderTrigger, setRenderTrigger] = useState<number>(0)

    // Initial values
    useEffect(() => {
        if (selectedFoodDish.id === '') {
            return
        }

        const food = foods.find(food => food._id === selectedFoodDish.id)

        if (!food) {
            console.error('Food not found:', selectedFoodDish)
            return
        }

        setGrams(food.defaultServing)
        setRenderTrigger(renderTrigger + 1)
    }, [selectedFoodDish])

    // Update mealCaloriesIncrease when grams or quantity changes
    useEffect(() => {
        if (selectedFoodDish.id === '') {
            return
        }

        const food = foods.find(food => food._id === selectedFoodDish.id)

        if (!food) {
            console.error('Food not found: ', selectedFoodDish)
            return
        }

        setMacrosIncrease({
            calories: food.calories * grams * quantity,
            carbs: food.carbs * grams * quantity,
            protein: food.protein * grams * quantity,
            fats: food.fats  * grams * quantity,
        })
        setMealCaloriesIncrease((food.calories) * grams * quantity)
    }, [grams, quantity])

    // Update mealCalories when mealType, foodEaten, or dishEaten changes
    useEffect(() => {
        setMealCalories(
            foodEaten
                .filter((foodEatenItem: FoodEaten) => foodEatenItem.mealType === mealType)
                .reduce((acc: number, foodEatenItem: FoodEaten) => {
                    const foodData = foods.find((foodItem) => foodItem._id === foodEatenItem.foodID)

                    if (!foodData) {
                        console.error('Food not found:', foodEatenItem)
                        return acc
                    }

                    return acc + foodData.calories * foodEatenItem.grams * foodEatenItem.quantity
                }, 0)
            + dishEaten
                .filter((dishEatenItem: DishEaten) => dishEatenItem.mealType === mealType)
                .reduce((acc: number, dishEatenItem: DishEaten) => {

                    const { calories } = calculateDishMacros(
                        foods, 
                        dishes, 
                        dishEatenItem.dishID, 
                        dishEatenItem.foodServing,
                        dishEatenItem.grams,
                        dishEatenItem.quantity
                    )
                    
                    return acc + calories
                }, 0)
        )
    }, [mealType, foodEaten, dishEaten])

    async function handleAddFood() {
        setIsLoading(true)

        if (selectedFoodDish.id === '') {
            setIsLoading(false)
            setIsError(true)
            return
        }

        await axios.post('/api/addFoodEaten', {
            foodID: selectedFoodDish.id,
            grams: grams,
            quantity: quantity,
            mealType: mealType,
            date: new Date()
        })

        await getData(['foodEaten'])

        setIsLoading(false)

        navigate('/dashboard')
    }
    
    return (
        <Grid
            container
            bgcolor={'primary.main'}
            p={isMobile ? '1em' : '2em'}
            mb={isMobile ? '1em' : '2em'}
            display={'flex'}
            justifyContent={'space-between'}
            sx={{
                boxShadow: 5,
                borderRadius: 5
            }}
        >
            {/* Title */}
            <AddFoodDishCardTitle 
                mealCalories={mealCalories}
                mealCaloriesIncrease={mealCaloriesIncrease}
            />

            {/* Input Fields */}
            <AddFoodDishTextField 
                setIsDish={setIsDish}
                selectedFoodDish={selectedFoodDish}
                setSelectedFoodDish={setSelectedFoodDish}
                grams={grams}
                setGrams={setGrams}
                quantity={quantity}
                setQuantity={setQuantity}
                setMacrosIncrease={setMacrosIncrease}
                setMealCaloriesIncrease={setMealCaloriesIncrease}
                isError={isError}
                setIsError={setIsError}
                renderTrigger={renderTrigger}
            />

            {/* Buttons */}
            <AddFoodDishButtons
                handleAddFoodOrDish={handleAddFood}
                isLoading={isLoading}
            />
        </Grid>
    )
}