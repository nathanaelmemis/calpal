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

export default function EditFoodDishEaten() {
    // Check if user is authenticated
    if (!checkAuth()) return

    // Check if state is lost
    checkState()

    const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'))
    const navigate = useNavigate()

    const {
        foods,
        dishes,
        foodEaten,
        dishEaten,
        getData,
        foodDishEatenEditing
    } = useContext(UserDataContext)

    const foodOptions = foods.map((option) => ({name: option.name, id: option._id}))
    const dishOptions = dishes.map((option) => ({name: option.name, id: option._id}))

    const [selectedFood, setSelectedFood] = useState<SelectedFoodDish>({id: '', name: ''})
    const [autocompleteInputValue, setAutocompleteInputValue] = useState('')
    
    const [mealType, setMealType] = useState('breakfast')
    const [grams, setGrams] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const [foodServing, setFoodServing] = useState([0])

    const [isLoading, setIsLoading] = useState(false)
    const [isDish, setIsDish] = useState(false)

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    const [renderTrigger, setRenderTrigger] = useState<number>(0)

    // Get initial food/dish data
    useEffect(() => {
        const foodEatenItem = foodEaten.find((foodEatenItem: FoodEaten) => {return foodEatenItem._id === foodDishEatenEditing.foodDishEatenEditingID})
        const dishEatenItem = dishEaten.find((dishEatenItem: DishEaten) => {return dishEatenItem._id === foodDishEatenEditing.foodDishEatenEditingID})
    
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

            setSelectedFood({id: food._id, name: food.name})
            setAutocompleteInputValue(food.name)
            setMealType(foodEatenItem.mealType)
            setGrams(foodEatenItem.grams)
            setQuantity(foodEatenItem.quantity)
            setIsDish(false)
        } else if (dishEatenItem) {
            const dish = dishes.find((dish: Dish) => dish._id === dishEatenItem.dishID)

            if (!dish) {
                console.error('Dish not found:', dishEatenItem)
                return
            }

            setSelectedFood({id: dish._id, name: dish.name})
            setAutocompleteInputValue(dish.name)
            setMealType(dishEatenItem.mealType)
            setGrams(dishEatenItem.grams)
            setQuantity(dishEatenItem.quantity)
            setIsDish(true)
            setFoodServing([...dishEatenItem.foodServing])
        }

        setRenderTrigger(renderTrigger + 1)
    }, [])

    function handleOnChangeAutocomplete(_event: any, newValue: SelectedFoodDish | null) {
        if (!newValue) return

        const dish = dishes.find((dish: Dish) => dish._id === newValue.id)

        if (dish) {
            setIsDish(true)
            setAutocompleteInputValue(dish.name)
            setSelectedFood({id: dish._id, name: dish.name})
            setGrams(dish.defaultServing)
            setQuantity(1)
            setFoodServing([...dish.foods.map((dishFoodItem: DishFood) => dishFoodItem.defaultServing)])
            return
        }

        const food = foods.find((food: Food) => food._id === newValue.id)

        if (food) {
            setIsDish(false)
            setAutocompleteInputValue(food.name)
            setSelectedFood({id: food._id, name: food.name})
            setGrams(food.defaultServing)
            setQuantity(1)
        } else {
            console.error('Food/Dish not found:', newValue)
        }
    }

    async function handleSave() {
        setIsLoading(true)

        try {
            if (isDish) {
                const res = await axios.put('/api/updateDishEaten', {
                    dishEatenID: foodDishEatenEditing.foodDishEatenEditingID,
                    dishID: selectedFood.id,
                    grams: grams,
                    quantity: quantity,
                    mealType: mealType,
                    foodServing: foodServing
                })
    
                if (res.status === 200) {
                    await getData(['dishEaten'])
                    setIsLoading(false)
                    navigate('/showFoodEaten')
                }
            } else {
                const res = await axios.put('/api/updateFoodEaten', {
                    foodEatenID: foodDishEatenEditing.foodDishEatenEditingID,
                    foodID: selectedFood.id,
                    grams: grams,
                    quantity: quantity,
                    mealType: mealType
                })
    
                if (res.status === 200) {
                    await getData(['foodEaten'])
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
                await getData([isDish ? 'dishEaten' : 'foodEaten'])
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
                            value={selectedFood}
                            inputValue={autocompleteInputValue}
                            onChange={handleOnChangeAutocomplete}
                            onInputChange={(_event, newInputValue) => {setAutocompleteInputValue(newInputValue)}}
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
                        selectedFood={selectedFood}
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
                foodDishEatenToDelete={selectedFood.name}
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