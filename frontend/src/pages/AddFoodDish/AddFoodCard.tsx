import { Grid, useMediaQuery, useTheme } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DishInterface, FoodInterface, MealsDishEatenInterface, MealsFoodEatenInterface, UserDataInterface } from "../../Interface";
import AddFoodDishButtons from "./AddFoodDishButtons";
import AddFoodDishCardTitle from "./AddFoodDishCardTitle";
import AddFoodDishTextField from "./AddFoodDishTextField";

interface AddFoodCardInterface {
    getAndHandleUserData: Function,
    userData: UserDataInterface,
    mealType: string,
    setIsDish: Function,
    selectedFood: string,
    setSelectedFood: Function,
    foods: FoodInterface[],
    dishes: DishInterface[],
    mealsFoodEaten: MealsFoodEatenInterface,
    mealsDishEaten: MealsDishEatenInterface
    setMacrosIncrease: (calories: number, protein: number, carbs: number, fats: number, grams: number, quantity: number) => void
}

export function AddFoodCard({ getAndHandleUserData, userData, mealType, setIsDish, selectedFood, setSelectedFood, foods, dishes, mealsFoodEaten, mealsDishEaten, setMacrosIncrease }: AddFoodCardInterface) {
    const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'))
    const navigate = useNavigate();

    const [grams, setGrams] = useState(0)
    const [quantity, setQuantity] = useState(1) 

    const [mealCalories, setMealCalories] = useState(0)
    const [mealCaloriesIncrease, setMealCaloriesIncrease] = useState(0)

    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)

    const [renderTrigger, setRenderTrigger] = useState(0)

    // Update mealCaloriesIncrease when grams or quantity changes
    useEffect(() => {
        const food = foods.find(food => food.name === selectedFood)

        setMacrosIncrease(food?.calories || 0, food?.protein || 0, food?.carbs || 0, food?.fats || 0, grams, quantity)
        setMealCaloriesIncrease((food?.calories || 0) * grams * quantity)
    }, [grams, quantity])

    // Check if meal type is valid
    useEffect(() => {
        setMealCalories(
            mealsFoodEaten[mealType.toLowerCase()].reduce((acc: number, item: any) => acc + item.calories * item.grams * item.quantity, 0)
            + mealsDishEaten[mealType.toLowerCase()].reduce((acc: number, item: any) => acc + item.calories * item.grams * item.quantity, 0)
        )
    }, [mealType])

    async function handleAddFood() {
        setIsLoading(true)

        if (!selectedFood) {
            setIsLoading(false)
            setIsError(true)
            return
        }

        await axios.post('/api/addFoodEaten', {
            food: selectedFood,
            grams: grams,
            quantity: quantity,
            mealType: mealType
        })

        await getAndHandleUserData()

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
            <AddFoodDishCardTitle
                mealType={mealType}
                mealCalories={mealCalories}
                mealCaloriesIncrease={mealCaloriesIncrease}
                userData={userData}
            />

            {/* Input Fields */}
            <AddFoodDishTextField
                setIsDish={setIsDish}
                foods={foods}
                dishes={dishes}
                selectedFood={selectedFood}
                setSelectedFood={setSelectedFood}
                grams={grams}
                setGrams={setGrams}
                quantity={quantity}
                setQuantity={setQuantity}
                setMacrosIncrease={setMacrosIncrease}
                setMealCaloriesIncrease={setMealCaloriesIncrease}
                isError={isError}
                setIsError={setIsError}
                renderTrigger={renderTrigger}
                setRenderTrigger={setRenderTrigger}
            />

            {/* Buttons */}
            <AddFoodDishButtons
                handleAddFoodOrDish={handleAddFood}
                isLoading={isLoading}
            />
        </Grid>
    )
}