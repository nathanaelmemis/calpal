import { Grid, Autocomplete, TextField, IconButton, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { DishFoodInterface, DishInterface, FoodInterface } from "../../Interface";
import { RemoveCircle as RemoveCircleIcon, AddCircle as AddCircleIcon } from '@mui/icons-material';
import EditDishFormFoodRowTextField from "./EditDishFormFoodRowTextField";
import EditFoodDishButtons from "./EditFoodDishButtons";
import axios from "axios";

interface EditDishFormProps {
    getAndHandleUserData: () => void
    foods: FoodInterface[]
    dishes: DishInterface[]
}

function EditDishForm(props: EditDishFormProps) {
    const options = props.dishes.map((option: DishInterface) => option.name)

    const [refreshTrigger, setRefreshTrigger] = useState(Date.now().toFixed())
    const [isLoading, setIsLoading] = useState(false)
    const [isDishAlreadyExist, setIsDishAlreadyExist] = useState(false)

    const [autocompleteInputValue, setAutocompleteInputValue] = useState(options[0])
    const [selectedDish, setSelectedDish] = useState(options[0])

    const [foodName, setDishName] = useState('')    
    const [defaultServing, setDefaultServing] = useState(1)
    const [dishData, setDishData]: [DishFoodInterface[], (dishData: DishFoodInterface[]) => any] = useState([
        { food: '', defaultServing: 1 }
    ])

    // Set food details when selected food changes
    useEffect(() => {
        const dish = props.dishes.find((dish: DishInterface) => dish.name === selectedDish)

        if (dish) {
            setDishName(dish.name)
            setDefaultServing(dish.defaultServing)
            setDishData([...dish.foods])

            setRefreshTrigger(Date.now().toFixed())
        }
    }, [selectedDish])

    function handleRemoveButtonOnClick(index: number) {
        const disDataTemp = dishData.filter((_, i) => i !== index)

        if (disDataTemp.length === 0) {
            setDishData([{food: '', defaultServing: 1}])
        } else {
            setDishData(disDataTemp)
        }

        setRefreshTrigger(Date.now().toFixed())
    }

    async function handleUpdate() {
        setIsLoading(true)

        try {
            const dish = props.dishes.find((dish: DishInterface) => dish.name === selectedDish)

            if (!dish) throw new Error('Dish not found')

            const res = await axios.post('/api/updateDish', {
                dishID: dish._id,
                name: foodName !== dish.name ? foodName : '',
                defaultServing: defaultServing !== dish.defaultServing ? defaultServing : -1,
                foods: dishData
            })

            if (res.status === 200) {
                await props.getAndHandleUserData()
                setSelectedDish(foodName)
            }
        } catch (error: any) {
            if (error.response.data === 'Dish already exists.') {
                setIsDishAlreadyExist(true)
            }

            console.log(error)
        }

        setIsLoading(false)
    }
    
    return (
        <>
            {/* Dish Editing */}
            <Grid
                item
                xs={12}
                mb={2}
            >
                <Autocomplete
                    disablePortal
                    options={options}
                    fullWidth   
                    renderInput={(params) => <TextField {...params} label="Dish Editing" color="secondary"/>}
                    value={selectedDish}
                    onChange={(_event, newValue) => {setSelectedDish(newValue || options[0])}}
                    inputValue={autocompleteInputValue}
                    onInputChange={(_event, newInputValue) => {setAutocompleteInputValue(newInputValue)}}
                    isOptionEqualToValue={(options, value) => options.valueOf === value.valueOf}
                />
            </Grid>

            {/* Dish Name */}
            <Grid
                item
                xs={12}
            >
                <TextField
                    error={isDishAlreadyExist}
                    helperText={isDishAlreadyExist ? 'Dish already exists.' : ''}
                    fullWidth 
                    label='Dish Name'
                    color="secondary"
                    value={foodName}
                    onChange={(e) => setDishName(e.target.value)}
                />
            </Grid>

            {/* Rendering of Dish Foods */}
            {
                dishData.map((food: DishFoodInterface, index: number) => (
                    <Grid
                        key={index + refreshTrigger}
                        item
                        xs={12}
                        display={'flex'}
                        alignItems={'center'}
                    >
                        <Grid
                            item
                            xs={1}
                            display={'flex'}
                            justifyContent={'center'}>  
                            <IconButton
                                color="error"
                                onClick={() => handleRemoveButtonOnClick(index)}
                            >
                                <RemoveCircleIcon />
                            </IconButton>
                        </Grid>
                        <Grid
                            item
                            xs={11}
                            columnGap={2}
                            display={'flex'}
                        >   
                            <EditDishFormFoodRowTextField 
                                foods={props.foods}  
                                foodInitialValue={food.food}
                                defaultServingInitialValue={food.defaultServing}
                                index={index}
                                dishData={dishData}
                                setDishData={setDishData}
                            />
                        </Grid>
                    </Grid>
                ))
            }

            {/* Add Food TextField Button */}
            <Button 
                fullWidth
                color="secondary"
                variant="contained"
                onClick={() => setDishData([...dishData, {food: '', defaultServing: 1}])}
                sx={{
                    mt: '1em'
                }}
            >
                <AddCircleIcon 
                    fontSize="medium"
                />
            </Button>

            <EditFoodDishButtons 
                isLoading={isLoading}
                handleUpdate={handleUpdate}
            />
        </>
    )
}

export default EditDishForm;