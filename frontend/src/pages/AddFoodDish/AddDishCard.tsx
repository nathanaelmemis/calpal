import { Grid, TextField, useMediaQuery, useTheme } from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserDataInterface, FoodInterface, DishInterface, MealsFoodEatenInterface, MealsDishEatenInterface, DishFoodInterface } from "../../Interface";
import AddFoodDishButtons from "./AddFoodDishButtons";
import AddFoodDishCardTitle from "./AddFoodDishCardTitle";
import AddFoodDishTextField from "./AddFoodDishTextField";
import AddDishCardServingTextField from "./AddDishCardServingTextField";

interface AddDishCardInterface {
    getAndHandleUserData: Function,
    userData: UserDataInterface,
    mealType: string,
    setIsDish: (isDish: boolean) => void,
    selectedFood: string,
    setSelectedFood: (food: string) => void,
    foods: FoodInterface[],
    dishes: DishInterface[],
    mealsFoodEaten: MealsFoodEatenInterface,
    mealsDishEaten: MealsDishEatenInterface,
    setMacrosIncrease: (calories: number, protein: number, carbs: number, fats: number, grams: number, quantity: number) => void
}

function AddDishCard(props: AddDishCardInterface) {
    const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'))
    const navigate = useNavigate();

    const [grams, setGrams] = useState(0)
    const [quantity, setQuantity] = useState(1) 
    const [foodServing, setFoodServing] = useState(props.dishes.find(dish => dish.name === props.selectedFood)?.foods.map((food) => {return food.defaultServing }) || [0])

    const [mealCalories, setMealCalories] = useState(0)
    const [mealCaloriesIncrease, setMealCaloriesIncrease] = useState(0)

    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)

    const [renderTrigger, setRenderTrigger] = useState(0)

    const [renderedDishFoodItems, setRenderedDishFoodItems]: [Element[], Function] = useState([])

    // Update mealCaloriesIncrease when grams or quantity changes
    useEffect(() => {
        const dish = props.dishes.find(dish => dish.name === props.selectedFood)

        if (!dish) return

        let calories = 0
        let carbs = 0
        let protein = 0
        let fats = 0

        dish.foods.forEach((food: DishFoodInterface, index: number) => {
            const foodDetails = props.foods.find((foodItem: FoodInterface) => foodItem.name === food.food)

            calories += (foodDetails?.calories || 0) * foodServing[index]
            protein += (foodDetails?.protein || 0) * foodServing[index]
            carbs += (foodDetails?.carbs || 0) * foodServing[index]
            fats += (foodDetails?.fats || 0) * foodServing[index]
        })

        const dishEatenItemTotalServing = foodServing.reduce((acc: number, serving: number) => acc + serving, 0)

        if (dishEatenItemTotalServing) {
            calories /= dishEatenItemTotalServing
            protein /= dishEatenItemTotalServing
            carbs /= dishEatenItemTotalServing
            fats /= dishEatenItemTotalServing
        }

        props.setMacrosIncrease(calories, protein, carbs, fats, grams, quantity)
        setMealCaloriesIncrease(calories * grams * quantity)
    }, [grams, quantity, foodServing])

    // Check if meal type is valid
    useEffect(() => {
        setMealCalories(
            props.mealsFoodEaten[props.mealType.toLowerCase()].reduce((acc: number, item: any) => acc + item.calories * item.grams * item.quantity, 0)
            + props.mealsDishEaten[props.mealType.toLowerCase()].reduce((acc: number, item: any) => acc + item.calories * item.grams * item.quantity, 0)
        )
    }, [props.mealType])

    // Update renderedDishFoodItems when selectedFood changes
    useEffect(() => {
        setRenderedDishFoodItems(props.dishes.find(dish => dish.name === props.selectedFood)?.foods.map((dishFoodItem: DishFoodInterface, index: number) => (
            <Grid
                container
                key={index + renderTrigger}
                mt={'1em'}
                columnSpacing={2}
                justifyContent={'flex-end'}
            >
                <Grid
                    item
                    xs={7}
                >
                    <TextField 
                        value={dishFoodItem.food}
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
                    xs={4}
                >
                    <AddDishCardServingTextField
                        foodServing={foodServing}
                        setFoodServing={setFoodServing}
                        index={index}
                        dishes={props.dishes}
                        selectedFood={props.selectedFood}
                    />
                </Grid>
            </Grid>
        )) || [])
    }, [props.selectedFood, foodServing, renderTrigger])

    // Update foodServing when selectedFood changes
    useEffect(() => {
        setFoodServing(props.dishes.find(dish => dish.name === props.selectedFood)?.foods.map((food) => {return food.defaultServing }) || [0])
    }, [props.selectedFood])

    async function handleAddDish() {
        setIsLoading(true)

        if (!props.selectedFood) {
            setIsLoading(false)
            setIsError(true)
            return
        }

        await axios.post('/api/addDishEaten', {
            dish: props.selectedFood,
            grams: grams,
            quantity: quantity,
            mealType: props.mealType,
            foodServing: foodServing
        })

        await props.getAndHandleUserData()

        setIsLoading(false)

        navigate('/dashboard')
    }
    
    return (
        <Grid
            container
            bgcolor={'primary.main'}
            p={'1em 2em 1.5em 2em'}
            display={'flex'}
            justifyContent={'space-between'}
            sx={{
                boxShadow: 5,
                borderRadius: 5
            }}
        >
            <AddFoodDishCardTitle
                mealType={props.mealType}
                mealCalories={mealCalories}
                mealCaloriesIncrease={mealCaloriesIncrease}
                userData={props.userData}
            />

            {/* Input Fields */}
            <AddFoodDishTextField
                setIsDish={props.setIsDish}
                foods={props.foods}
                dishes={props.dishes}
                selectedFood={props.selectedFood}
                setSelectedFood={props.setSelectedFood}
                grams={grams}
                setGrams={setGrams}
                quantity={quantity}
                setQuantity={setQuantity}
                setMacrosIncrease={props.setMacrosIncrease}
                setMealCaloriesIncrease={setMealCaloriesIncrease}
                isError={isError}
                setIsError={setIsError}
                renderTrigger={renderTrigger}
                setRenderTrigger={setRenderTrigger}
            />

            {/* Dish Foods Text Field Rows */}
            <>
                {renderedDishFoodItems}
            </>

            {/* Buttons */}
            <AddFoodDishButtons
                handleAddFoodOrDish={handleAddDish}
                isLoading={isLoading}
            />
        </Grid>
    )
}

export default AddDishCard;