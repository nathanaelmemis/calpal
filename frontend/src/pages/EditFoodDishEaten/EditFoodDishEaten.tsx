import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import { Autocomplete, Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { CalculatorTextField } from "../../components/CalculatorTextField";
import { Dish } from "../../interfaces/dish";
import { DishEaten } from "../../interfaces/dishEaten";
import { DishFood } from "../../interfaces/dishFood";
import { Food } from "../../interfaces/food";
import { FoodEaten } from "../../interfaces/foodEaten";
import { checkAuth } from "../../utils/checkAuth";
import { DishFoodList } from "./EditFoodDishFoodList";
import { DeleteAlertDialog } from "./EditFoodDishDeleteAlertDialog";
import { UserDataContext } from "../../context/UserDataContext";
import { SelectedFoodDish } from "../../interfaces/selectedFoodDish";
import { checkState } from "../../utils/checkState";
import { MacrosCard } from "../../components/MacrosCard";
import { Macros } from "../../interfaces/macros";
import { calculateDishMacros } from "../../utils/calculateDishMacros";
import { MacrosIncreaseIndicator } from "../../components/MacrosIncreaseIndicator";
import { formatNumber } from "../../utils/formatNumber";
import { getColorFromValue } from "../../utils/getColorFromValue";

export default function EditFoodDishEaten() {
    // Check if user is authenticated
    if (!checkAuth()) return

    // Check if state is lost
    checkState()

    const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'))
    const navigate = useNavigate()

    const {
        userData,
        foods,
        dishes,
        foodEaten,
        dishEaten,
        updateData,
        deleteData,
        foodDishEatenEditing
    } = useContext(UserDataContext)

    const foodOptions = foods.map((option) => ({ name: option.name, id: option._id }))
    const dishOptions = dishes.map((option) => ({ name: option.name, id: option._id }))

    const [selectedFoodDish, setSelectedFood] = useState<SelectedFoodDish>({ id: '', name: '' })
    const [autocompleteInputValue, setAutocompleteInputValue] = useState('')

    const [mealCalories, setMealCalories] = useState<number>(0)

    const [caloriesIncrease, setCaloriesIncrease] = useState<number>(0)
    const [proteinIncrease, setProteinIncrease] = useState<number>(0)
    const [carbsIncrease, setCarbsIncrease] = useState<number>(0)
    const [fatsIncrease, setFatsIncrease] = useState<number>(0)

    const [mealType, setMealType] = useState('breakfast')
    const [grams, setGrams] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const [foodServing, setFoodServing] = useState([0])

    const [isLoading, setIsLoading] = useState(false)
    const [isDish, setIsDish] = useState(false)

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    const [renderTrigger, setRenderTrigger] = useState<number>(0)

    const [currentFoodMacros, setCurrentFoodMacros] = useState<Macros>({
        calories: 0,
        carbs: 0,
        protein: 0,
        fats: 0
    })

    function setMacrosIncrease(macros: Macros) {
        setCaloriesIncrease(macros.calories)
        setCarbsIncrease(macros.carbs)
        setProteinIncrease(macros.protein)
        setFatsIncrease(macros.fats)
    }

    // Get initial food/dish data
    useEffect(() => {
        const foodEatenItem = foodEaten.find((foodEatenItem: FoodEaten) => { return foodEatenItem._id === foodDishEatenEditing.foodDishEatenEditingID })
        const dishEatenItem = dishEaten.find((dishEatenItem: DishEaten) => { return dishEatenItem._id === foodDishEatenEditing.foodDishEatenEditingID })

        if (!foodEatenItem && !dishEatenItem) {
            console.error('Food/Dish Eaten not found:', foodDishEatenEditing)
            return
        }

        if (foodEatenItem && dishEatenItem) {
            console.error('ID collision between foodEaten and dishEaten:', foodEatenItem._id)
            return
        }

        if (foodEatenItem) {
            const food = foods.find((food: Food) => food._id === foodEatenItem.foodID)

            if (!food) {
                console.error('Food not found:', foodEatenItem)
                return
            }

            setSelectedFood({ id: food._id, name: food.name })
            setAutocompleteInputValue(food.name)
            setMealType(foodEatenItem.mealType)
            setGrams(foodEatenItem.grams)
            setQuantity(foodEatenItem.quantity)
            setIsDish(false)

            const macrosIncrease = {
                calories: food.calories * foodEatenItem.grams * foodEatenItem.quantity,
                carbs: food.carbs * foodEatenItem.grams * foodEatenItem.quantity,
                protein: food.protein * foodEatenItem.grams * foodEatenItem.quantity,
                fats: food.fats * foodEatenItem.grams * foodEatenItem.quantity,
            }
            setCurrentFoodMacros(macrosIncrease)
            setMacrosIncrease(macrosIncrease)
        } else if (dishEatenItem) {
            const dish = dishes.find((dish: Dish) => dish._id === dishEatenItem.dishID)

            if (!dish) {
                console.error('Dish not found:', dishEatenItem)
                return
            }

            setSelectedFood({ id: dish._id, name: dish.name })
            setAutocompleteInputValue(dish.name)
            setMealType(dishEatenItem.mealType)
            setGrams(dishEatenItem.grams)
            setQuantity(dishEatenItem.quantity)
            setIsDish(true)
            setFoodServing([...dishEatenItem.foodServing])

            const macrosIncrease = {
                ...calculateDishMacros(
                    foods,
                    dishes,
                    dish._id,
                    dishEatenItem.foodServing,
                    dishEatenItem.grams,
                    dishEatenItem.quantity
                )
            }
            setCurrentFoodMacros(macrosIncrease)
            setMacrosIncrease(macrosIncrease)
        }

        setRenderTrigger(renderTrigger + 1)
    }, [])

    function handleOnChangeAutocomplete(_event: any, newValue: SelectedFoodDish | null) {
        if (!newValue) return

        const dish = dishes.find((dish: Dish) => dish._id === newValue.id)

        if (dish) {
            setIsDish(true)
            setAutocompleteInputValue(dish.name)
            setSelectedFood({ id: dish._id, name: dish.name })
            setQuantity(1)
            setFoodServing([...dish.foods.map((dishFoodItem: DishFood) => dishFoodItem.defaultServing)])

            const selectedDishMacros = {
                ...calculateDishMacros(
                    foods,
                    dishes,
                    dish._id,
                    dish.foods.map((dishFood) => dishFood.defaultServing),
                    grams,
                    quantity
                )
            }
            setMacrosIncrease(selectedDishMacros)
            return
        }

        const food = foods.find((food: Food) => food._id === newValue.id)

        if (food) {
            setIsDish(false)
            setAutocompleteInputValue(food.name)
            setSelectedFood({ id: food._id, name: food.name })
            setQuantity(1)
            setMacrosIncrease({
                calories: food.calories * grams * quantity,
                carbs: food.carbs * grams * quantity,
                protein: food.protein * grams * quantity,
                fats: food.fats * grams * quantity,
            })

        } else {
            console.error('Food/Dish not found:', newValue)
        }
    }

    // Update mealCaloriesIncrease when grams or quantity changes
    useEffect(() => {
        const dish = dishes.find((dish: Dish) => dish._id === selectedFoodDish.id)

        if (dish) {
            setMacrosIncrease(
                calculateDishMacros(
                    foods,
                    dishes,
                    dish._id,
                    foodServing,
                    grams,
                    quantity
                ))
            return
        }

        const food = foods.find((food: Food) => food._id === selectedFoodDish.id)

        if (food) {
            setMacrosIncrease({
                calories: food.calories * grams * quantity,
                carbs: food.carbs * grams * quantity,
                protein: food.protein * grams * quantity,
                fats: food.fats * grams * quantity,
            })

        } else {
            console.error('Food/Dish not found:', selectedFoodDish)
        }
    }, [grams, quantity, foodServing])

    // Update mealCalories when foodEaten or dishEaten changes
    useEffect(() => {
        const currentFoodEatenItem = foodEaten.find((foodEatenItem: FoodEaten) => foodEatenItem._id === foodDishEatenEditing.foodDishEatenEditingID)
        const currentDishEatenItem = dishEaten.find((dishEatenItem: DishEaten) => dishEatenItem._id === foodDishEatenEditing.foodDishEatenEditingID)
        let isFoodEatenWithinMealType = false
        if (currentFoodEatenItem) {
            isFoodEatenWithinMealType = currentFoodEatenItem.mealType === mealType
        } else if (currentDishEatenItem) {
            isFoodEatenWithinMealType = currentDishEatenItem.mealType === mealType
        } else {
            console.error('Food/Dish not found:', selectedFoodDish)
            return
        }

        setMealCalories(
            (isFoodEatenWithinMealType ? 0 : currentFoodMacros.calories) +
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
    }, [selectedFoodDish, mealType, foodEaten, dishEaten])

    async function handleSave() {
        setIsLoading(true)

        try {
            if (isDish) {
                const dishEatenItem = dishEaten.find((dishEaten: DishEaten) => dishEaten._id === foodDishEatenEditing.foodDishEatenEditingID)

                if (!dishEatenItem) throw new Error('Dish not found')

                const res = await axios.put('/api/updateDishEaten', {
                    dishEatenID: foodDishEatenEditing.foodDishEatenEditingID,
                    dishID: selectedFoodDish.id !== dishEatenItem.dishID ? selectedFoodDish.id : '',
                    grams: grams !== dishEatenItem.grams ? grams : -1,
                    quantity: quantity !== dishEatenItem.quantity ? quantity : -1,
                    mealType: mealType !== dishEatenItem.mealType ? mealType : '',
                    foodServing: foodServing !== dishEatenItem.foodServing ? foodServing : []
                })

                if (res.status === 200) {
                    updateData('dishEaten', {
                        _id: foodDishEatenEditing.foodDishEatenEditingID,
                        userID: res.data.userID,
                        dishID: selectedFoodDish.id,
                        grams: grams,
                        quantity: quantity,
                        mealType: mealType,
                        foodServing: foodServing,
                        date: dishEatenItem.date
                    })
                    setIsLoading(false)
                    navigate('/showFoodEaten')
                }
            } else {
                const foodEatenItem = foodEaten.find((foodEaten: FoodEaten) => foodEaten._id === foodDishEatenEditing.foodDishEatenEditingID)

                if (!foodEatenItem) throw new Error('Food not found')

                const res = await axios.put('/api/updateFoodEaten', {
                    foodEatenID: foodDishEatenEditing.foodDishEatenEditingID,
                    foodID: selectedFoodDish.id !== foodEatenItem.foodID ? selectedFoodDish.id : '',
                    grams: grams !== foodEatenItem.grams ? grams : -1,
                    quantity: quantity !== foodEatenItem.quantity ? quantity : -1,
                    mealType: mealType !== foodEatenItem.mealType ? mealType : ''
                })

                if (res.status === 200) {
                    updateData('foodEaten', {
                        _id: foodDishEatenEditing.foodDishEatenEditingID,
                        userID: res.data.userID,
                        foodID: selectedFoodDish.id,
                        grams: grams,
                        quantity: quantity,
                        mealType: mealType,
                        date: foodEatenItem.date
                    })
                    setIsLoading(false)
                    navigate('/showFoodEaten')
                }
            }
        } catch (error) {
            console.log(error)
            setIsLoading(false)
        }
    }

    async function handleDelete() {
        setIsLoading(true)

        try {
            const res = await axios.delete('/api/deleteFoodDishEaten', {
                data: {
                    foodDishEatenID: foodDishEatenEditing.foodDishEatenEditingID,
                    isDish: isDish
                }
            })

            if (res.status === 200) {
                deleteData(isDish ? 'dishEaten' : 'foodEaten', foodDishEatenEditing.foodDishEatenEditingID)

                setIsLoading(false)
                navigate('/showFoodEaten')
            }
        } catch (error) {
            console.log(error)
            setIsLoading(false)
        }

        setIsLoading(false)
    }

    return (
        <>
            <Header />

            <MacrosCard
                caloriesIncrease={caloriesIncrease - currentFoodMacros.calories}
                proteinIncrease={proteinIncrease - currentFoodMacros.protein}
                carbsIncrease={carbsIncrease - currentFoodMacros.carbs}
                fatsIncrease={fatsIncrease - currentFoodMacros.fats}
            />

            <MacrosIncreaseIndicator
                caloriesIncrease={caloriesIncrease}
                proteinIncrease={proteinIncrease}
                carbsIncrease={carbsIncrease}
                fatsIncrease={fatsIncrease}
            />

            <Grid
                bgcolor={'primary.main'}
                p={isMobile ? '1em' : '2em'}
                mb={'2em'}
                sx={{
                    boxShadow: 5,
                    borderRadius: 5
                }}
                display={'flex'}
                container
            >
                {/* Title */}
                <Grid
                    xs={12}
                    item
                    mb={'1em'}
                >
                    <Typography
                        variant={'h6'}
                        fontWeight={'bold'}
                    >
                        Editing Food/Dish Eaten
                    </Typography>
                    <Typography
                        variant={isMobile ? 'body2' : 'body1'}
                        color={getColorFromValue(formatNumber(mealCalories + caloriesIncrease - currentFoodMacros.calories), userData[mealType + 'CaloriesLimit'] as number, useTheme())}
                    >
                        {`${formatNumber(mealCalories + caloriesIncrease - currentFoodMacros.calories)} / ${userData[mealType + 'CaloriesLimit']} g`}
                    </Typography>
                </Grid>

                {/* Food, Grams, & Quantity Text Fields */}
                <Grid
                    container
                    display={'flex'}
                    spacing={2}
                    mb={'1em'}
                >
                    <Grid
                        sm={5.5}
                        xs={12}
                        item
                    >
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={isDish ? dishOptions : foodOptions}
                            getOptionLabel={(option) => option.name}
                            fullWidth
                            renderInput={(params) => <TextField {...params} label={isDish ? "Dish" : "Food"} color="secondary" />}
                            value={selectedFoodDish}
                            inputValue={autocompleteInputValue}
                            onChange={handleOnChangeAutocomplete}
                            onInputChange={(_event, newInputValue) => { setAutocompleteInputValue(newInputValue) }}
                            isOptionEqualToValue={(options, value) => options.id.valueOf === value.id.valueOf}
                            sx={(theme) => ({
                                '& .MuiAutocomplete-input': {
                                    fontSize: isMobile ? theme.typography.body2.fontSize : theme.typography.body1.fontSize
                                },
                            })}
                            size={isMobile ? "small" : "medium"}
                        />
                    </Grid>
                    <Grid
                        sm={2.5}
                        xs={12}
                        item
                    >
                        <FormControl
                            fullWidth
                            color="secondary"
                        >
                            <InputLabel id="demo-simple-select-label">Meal Type</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={mealType[0].toLowerCase() + mealType.slice(1)}
                                label="Meal Type"
                                onChange={(e) => setMealType(e.target.value)}
                                sx={(theme) => ({
                                    '& .MuiSelect-select': {
                                        fontSize: isMobile ? theme.typography.body2.fontSize : theme.typography.body1.fontSize,
                                    },
                                })}
                                size={isMobile ? "small" : "medium"}
                            >
                                <MenuItem value={'breakfast'}>Breakfast</MenuItem>
                                <MenuItem value={'lunch'}>Lunch</MenuItem>
                                <MenuItem value={'snacks'}>Snacks</MenuItem>
                                <MenuItem value={'dinner'}>Dinner</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid
                        sm={2}
                        xs={6}
                        item
                    >
                        <CalculatorTextField
                            label="Serving (g)"
                            initialValue={grams}
                            renderTrigger={renderTrigger}
                            setNumber={(newNumberValue: number) => setGrams(newNumberValue)}
                        />
                    </Grid>
                    <Grid
                        sm={2}
                        xs={6}
                        item
                    >
                        <CalculatorTextField
                            label="Quantity"
                            initialValue={quantity}
                            renderTrigger={renderTrigger}
                            setNumber={(newNumberValue: number) => setQuantity(newNumberValue)}
                        />
                    </Grid>
                </Grid>

                {/* Dish Foods List */}
                {
                    isDish &&
                    <DishFoodList
                        dishes={dishes}
                        selectedFoodDish={selectedFoodDish}
                        foodServing={foodServing}
                        handleOnChangeServing={(e: any, index: number, setServing: (newValue: number) => void) => {
                            const newFoodServing = [...foodServing]
                            newFoodServing[index] = parseInt(e.target.value) || 0
                            setFoodServing(newFoodServing)
                            setServing(parseInt(e.target.value) || 0)
                        }}
                    />
                }


                {/* Buttons */}
                <Box
                    display={'flex'}
                    justifyContent={'space-between'}
                    width={'100%'}
                >
                    <LoadingButton
                        loading={isLoading}
                        color="error"
                        variant="contained"
                        onClick={() => setIsDeleteDialogOpen(true)}
                        size={isMobile ? "small" : "medium"}
                    >
                        Delete
                    </LoadingButton>
                    <Grid>
                        <Button
                            color="secondary"
                            variant="contained"
                            sx={{
                                mr: '1em'
                            }}
                            onClick={() => navigate('/showFoodEaten')}
                            size={isMobile ? "small" : "medium"}
                        >
                            Cancel
                        </Button>
                        <LoadingButton
                            loading={isLoading}
                            color="secondary"
                            variant="contained"
                            onClick={handleSave}
                            size={isMobile ? "small" : "medium"}
                        >
                            Save
                        </LoadingButton>
                    </Grid>
                </Box>
            </Grid>

            <DeleteAlertDialog
                foodDishEatenToDelete={selectedFoodDish.name}
                open={isDeleteDialogOpen}
                setOpen={setIsDeleteDialogOpen}
                handleDelete={() => {
                    setIsDeleteDialogOpen(false)
                    handleDelete()
                }}
            />
        </>
    )
}