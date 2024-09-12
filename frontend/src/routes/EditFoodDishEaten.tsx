import axios from "axios";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { DishEatenInterface, DishFoodInterface, DishInterface, FoodEatenInterface, FoodInterface } from "../Interface";
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { CalculatorTextField } from "../components/CalculatorTextField";

interface EditFoodDishEatenProps {
    userName: string,
    isDataPresent: boolean,
    getAndHandleUserData: () => void,
    foodDishEatenEditing: {foodDishEatenEditingID: string, isDish: boolean},
    foods: FoodInterface[],
    dishes: DishInterface[],
    foodEaten: FoodEatenInterface[],
    dishEaten: DishEatenInterface[],
}

export default function EditFoodDishEaten(props: EditFoodDishEatenProps) {
    const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'))
    const navigate = useNavigate()

    const [selectedFood, setSelectedFood] = useState('')
    const [autocompleteInputValue, setAutocompleteInputValue] = useState('')
    
    const [mealType, setMealType] = useState('Breakfast')
    const [grams, setGrams] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const [foodServing, setFoodServing] = useState([0])

    const [isLoading, setIsLoading] = useState(false)
    const [isDish, setIsDish] = useState(false)

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    // Check if user is authenticated
    useEffect(() => {
        async function checkAuth() {
            try {
                const res = await axios.post('/api/authenticate')
    
                if (res.status !== 200) {
                    navigate('/login')
                }
            } catch (error) {
                console.log(error)
                navigate('/login')
                return
            }
        }

        checkAuth()
    }, [])

    // Get user data
    useEffect(() => {
        if (!props.isDataPresent) {
            navigate('/dashboard')
        }
    })

    // Get initial food/dish data
    useEffect(() => {
        const foodEatenItem = props.foodEaten.find((foodEatenItem: FoodEatenInterface) => {return foodEatenItem._id === props.foodDishEatenEditing.foodDishEatenEditingID})
        const dishEatenItem = props.dishEaten.find((dishEatenItem: DishEatenInterface) => {return dishEatenItem._id === props.foodDishEatenEditing.foodDishEatenEditingID})
    
        if (foodEatenItem) {
            setSelectedFood(foodEatenItem.food)
            setGrams(foodEatenItem.grams)
            setQuantity(foodEatenItem.quantity)
            setIsDish(false)
        } else if (dishEatenItem) {
            setSelectedFood(dishEatenItem.dish)
            setGrams(dishEatenItem.grams)
            setQuantity(dishEatenItem.quantity)
            setIsDish(true)
            setFoodServing([...dishEatenItem.foodServing])
        }
    }, [])

    function handleOnChangeAutocomplete(_event: any, newValue: any) {
        const dish = props.dishes.find((dish: DishInterface) => dish.name === newValue)

        if (dish) {
            setIsDish(true)
            setAutocompleteInputValue(dish.name || selectedFood)
            setSelectedFood(dish.name)
            setGrams(dish.defaultServing)
            setQuantity(1)
            setFoodServing([...dish.foods.map((dishFoodItem: DishFoodInterface) => dishFoodItem.defaultServing)])
            return
        }

        const food = props.foods.find((food: FoodInterface) => food.name === newValue)

        if (food) {
            setIsDish(false)
            setAutocompleteInputValue(food.name || selectedFood)
            setSelectedFood(food.name)
            setGrams(food.defaultServing)
            setQuantity(1)
        }
    }

    async function handleSave() {
        setIsLoading(true)

        try {
            if (isDish) {
                const res = await axios.put('/api/updateDishEaten', {
                    dishEatenID: props.foodDishEatenEditing.foodDishEatenEditingID,
                    dish: selectedFood,
                    grams: grams,
                    quantity: quantity,
                    mealType: mealType,
                    foodServing: foodServing
                })
    
                if (res.status === 200) {
                    await props.getAndHandleUserData()
                    setIsLoading(false)
                    navigate('/showFoodEaten')
                }
            } else {
                const res = await axios.put('/api/updateFoodEaten', {
                    foodEatenID: props.foodDishEatenEditing.foodDishEatenEditingID,
                    food: selectedFood,
                    grams: grams,
                    quantity: quantity,
                    mealType: mealType
                })
    
                if (res.status === 200) {
                    await props.getAndHandleUserData()
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
                    foodDishEatenID: props.foodDishEatenEditing.foodDishEatenEditingID,
                    isDish: isDish
                }
            })

            if (res.status === 200) {
                await props.getAndHandleUserData()
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
            <Header userName={props.userName} />

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
                            options={props.foods.map((option) => option.name).concat(props.dishes.map((option) => option.name))}
                            fullWidth   
                            renderInput={(params) => <TextField {...params} label="Food" color="secondary" />}
                            value={selectedFood}
                            inputValue={autocompleteInputValue}
                            onChange={handleOnChangeAutocomplete}
                            onInputChange={(_event, newInputValue) => {setAutocompleteInputValue(newInputValue)}}
                            isOptionEqualToValue={(options, value) => options.valueOf === value.valueOf}
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
                                value={mealType}
                                label="Meal Type"
                                onChange={(e) => setMealType(e.target.value)}
                                sx={(theme) => ({
                                    '& .MuiSelect-select': {
                                        fontSize: isMobile ? theme.typography.body2.fontSize : theme.typography.body1.fontSize,
                                    },
                                })}
                                size={isMobile ? "small" : "medium"}
                            >
                                <MenuItem value={'Breakfast'}>Breakfast</MenuItem>
                                <MenuItem value={'Lunch'}>Lunch</MenuItem>
                                <MenuItem value={'Snacks'}>Snacks</MenuItem>
                                <MenuItem value={'Dinner'}>Dinner</MenuItem>
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
                            setNumber={(newNumberValue: number) => setQuantity(newNumberValue)}
                        />
                    </Grid>
                </Grid>

                {/* Dish Foods List */}
                {
                    isDish && 
                    <DishFoodList 
                        dishes={props.dishes}
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
                foodDishEatenToDelete={selectedFood}
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

interface DishfoodListProps {
    dishes: DishInterface[],
    selectedFood: string,
    foodServing: number[],
    handleOnChangeServing: (e: any, index: number, setServing: (newValue: number) => void) => void
}

function DishFoodList(props: DishfoodListProps) {
    const [renderedList, setRenderedList]: [Element[], Function] = useState([])
    // Get dish data
    useEffect(() => {
        const dish = props.dishes.find((dish: DishInterface) => dish.name === props.selectedFood)

        if (!dish) return
        
        const renderedList = dish.foods.map((dishFoodItem: DishFoodInterface, index: number) => {

            return (
                <Grid
                    container
                    columnSpacing={2}
                    display={'flex'}
                    mb={'1em'}
                    justifyContent={'flex-end'}
                    key={Date.now().toFixed() + index.toString()}
                >
                    <Grid
                        item
                        xs={7}
                    >
                        <TextField 
                            value={dishFoodItem.food}
                            color="secondary" 
                            fullWidth
                            sx={{
                                pointerEvents: 'none',
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'rgba(0, 0, 0, 0.12)',
                                    }
                                }
                            }}
                        />
                    </Grid>
                    <Grid
                        item
                        xs={4}
                    >
                        <DishFoodItem 
                            index={index}
                            serving={props.foodServing[index]}
                            handleOnChangeServing={props.handleOnChangeServing}
                        />
                    </Grid>
                </Grid>
            )
        })

        setRenderedList(renderedList)
    }, [props.selectedFood])

    return (
        <>{renderedList}</>
    )
}

interface DishFoodItemProps {
    handleOnChangeServing: (e: any, index: number, setServing: (newValue: number) => void) => void,
    index: number,
    serving: number,
}

function DishFoodItem(props: DishFoodItemProps) {
    const [serving, setServing] = useState(props.serving)

    return (
        <TextField
            fullWidth
            color="secondary"
            label="Serving (g)"
            value={serving}
            onChange={(e) => props.handleOnChangeServing(e, props.index, setServing)}
        />
    )
}

interface DeleteAlertDialogProps {
    foodDishEatenToDelete: string,
    open: boolean,
    setOpen: (newValue: boolean) => void,
    handleDelete: () => void
}

function DeleteAlertDialog(props: DeleteAlertDialogProps) {
    const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'))

    return (
        <Dialog
            open={props.open}
            onClose={() => props.setOpen(false)}
            PaperProps={{
                sx: {
                    borderRadius: 5,
                    p: '.5em 1.25em 1.25em .5em',
                    width: '350px'
                }
            }}
        >
            <DialogTitle>{`Delete food/dish eaten ${props.foodDishEatenToDelete}?`}</DialogTitle>   
            <DialogContent>
                <DialogContentText>
                    This action cannot be reversed.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button 
                    color="secondary"
                    variant="contained"
                    onClick={() => props.setOpen(false)}
                    size={isMobile ? "small" : "medium"}
                >
                    Cancel
                </Button>
                <Button 
                    color="secondary"
                    variant="contained"
                    onClick={props.handleDelete}
                    size={isMobile ? "small" : "medium"}
                >
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    )
}