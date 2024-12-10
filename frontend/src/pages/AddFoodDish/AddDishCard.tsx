import { Grid, TextField, useMediaQuery, useTheme } from "@mui/material";
import axios from "axios";
import { useState, useEffect, ReactElement, Dispatch, SetStateAction, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AddFoodDishButtons from "./AddFoodDishButtons";
import AddFoodDishCardTitle from "./AddFoodDishCardTitle";
import AddFoodDishTextField from "./AddFoodDishTextField";
import AddDishCardServingTextField from "./AddDishCardServingTextField";
import { DishFood } from "../../interfaces/dishFood";
import { UserDataContext } from "../../context/UserDataContext";
import { FoodEaten } from "../../interfaces/foodEaten";
import { DishEaten } from "../../interfaces/dishEaten";
import { SelectedFoodDish } from "../../interfaces/selectedFoodDish";
import { calculateDishMacros } from "../../utils/calculateDishMacros";
import { Macros } from "../../interfaces/macros";

interface AddDishCard {
    setIsDish: Dispatch<SetStateAction<boolean>>,
    selectedFoodDish: SelectedFoodDish,
    setSelectedFoodDish: Dispatch<SetStateAction<SelectedFoodDish>>,
    setMacrosIncrease: (macros: Macros) => void
}

export function AddDishCard({ setIsDish, selectedFoodDish, setSelectedFoodDish, setMacrosIncrease}: AddDishCard) {
    const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'))
    const navigate = useNavigate();

    const {
        foods,
        dishes,
        foodEaten,
        dishEaten,
        updateData,
        mealType
    } = useContext(UserDataContext)

    const [grams, setGrams] = useState<number>(0)
    const [quantity, setQuantity] = useState<number>(1) 
    const [foodServing, setFoodServing] = useState<number[]>([0])

    const [mealCalories, setMealCalories] = useState<number>(0)
    const [mealCaloriesIncrease, setMealCaloriesIncrease] = useState<number>(0)

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isError, setIsError] = useState<boolean>(false)

    const [renderTrigger, setRenderTrigger] = useState<number>(0)

    // Initial values
    useEffect(() => {
        const dish = dishes.find(dish => dish._id === selectedFoodDish.id)

        if (!dish) {
            console.error('Dish not found:', selectedFoodDish)
            return
        }

        setGrams(dish.defaultServing)
        setFoodServing(dish.foods.map((food) => {return food.defaultServing }))
        setRenderTrigger(renderTrigger + 1)
    }, [selectedFoodDish])

    // Update mealCaloriesIncrease when grams or quantity changes
    useEffect(() => {
        const dishMacros = 
            {...calculateDishMacros(
                foods, 
                dishes, 
                selectedFoodDish.id, 
                foodServing,
                grams,
                quantity
            )}

        setMacrosIncrease({
            calories: dishMacros.calories,
            protein: dishMacros.protein,
            carbs: dishMacros.carbs,
            fats: dishMacros.fats
        })
        setMealCaloriesIncrease(dishMacros.calories)
    }, [grams, quantity, foodServing])

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

    async function handleAddDish() {
        setIsLoading(true)

        if (selectedFoodDish.id === '') {
            setIsLoading(false)
            setIsError(true)
            return
        }

        const dataToAdd = {
            dishID: selectedFoodDish.id,
            grams: grams,
            quantity: quantity,
            mealType: mealType,
            foodServing: foodServing,
            date: new Date().toISOString()
        }

        const result =  await axios.post('/api/addDishEaten', dataToAdd)

        if (result.status !== 200) {
            console.error('Failed to add dish eaten:', result.data)
            return
        }

        updateData('dishEaten', {...dataToAdd, _id: result.data._id, userID: result.data.userID})

        setIsLoading(false)

        navigate('/dashboard')
    }
    
    return (
        <Grid
            container
            bgcolor={'primary.main'}
            p={isMobile ? '1em' : '1em 2em 1.5em 2em'}
            mb={isMobile ? '1em' : '2em'}
            display={'flex'}
            justifyContent={'space-between'}
            sx={{
                boxShadow: 5,
                borderRadius: 5
            }}
        >
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

            {/* Dish Foods Text Field Rows */}
            <DishFoodList
                selectedFoodDish={selectedFoodDish}
                foodServing={foodServing}
                setFoodServing={setFoodServing}
                renderTrigger={renderTrigger}
            />

            {/* Buttons */}
            <AddFoodDishButtons
                handleAddFoodOrDish={handleAddDish}
                isLoading={isLoading}
            />
        </Grid>
    )
}

interface DishFoodListProps {
    selectedFoodDish: SelectedFoodDish
    foodServing: number[],
    setFoodServing: Dispatch<SetStateAction<number[]>>,
    renderTrigger: number
}

function DishFoodList({ selectedFoodDish, foodServing, setFoodServing, renderTrigger }: DishFoodListProps): ReactElement[] {
    const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'))

    const {
        foods,
        dishes
    } = useContext(UserDataContext)

    if (!selectedFoodDish) {
        return []
    }

    const dish = dishes.find(dish => dish._id === selectedFoodDish.id)

    if (!dish) {
        console.error('Dish not found:', selectedFoodDish)
        return []
    }

    return (
        dish.foods.map((dishFoodItem: DishFood, index: number) => {
            const food = foods.find(food => food._id === dishFoodItem.foodID)

            if (!food) {
                console.error('Food not found:', dishFoodItem)
            }

            return <Grid
                container
                key={index}
                columnSpacing={2}
                justifyContent={'flex-end'}
                mt={2}
            >
                <Grid
                    item
                    xs={7}
                >
                    <TextField 
                        value={food?.name || ''}
                        color="secondary" 
                        fullWidth
                        size={isMobile ? 'small' : 'medium'}
                        sx={(theme) => ({
                            pointerEvents: 'none',
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'rgba(0, 0, 0, 0.12)',
                                }
                            },
                            '& input': {
                                fontSize: {
                                    sm: theme.typography.body1.fontSize,
                                    xs: theme.typography.body2.fontSize
                                }
                            }
                        })}
                    />
                </Grid>
                <Grid
                    item
                    sm={4}
                    xs={5}
                >
                    <AddDishCardServingTextField
                        foodServing={foodServing}
                        setFoodServing={setFoodServing}
                        index={index}
                        renderTrigger={renderTrigger}
                    />
                </Grid>
            </Grid>
        })
    )
}