import { Autocomplete, Grid, Stack, TextField } from "@mui/material";
import { FoodInterface } from "../Interface";
import { useEffect, useState } from "react";
import EditFoodDishButtons from "./EditFoodDishButtons";
import axios from "axios";
import { CalculatorTextField } from "./CalculatorTextField";

interface EditFoodFormProps {
    getAndHandleUserData: () => void
    foods: FoodInterface[]
}

function EditFoodForm(props: EditFoodFormProps) {
    const options = props.foods.map((option: FoodInterface) => option.name)

    const [isLoading, setIsLoading] = useState(false)
    const [isFoodAlreadyExist, setIsFoodAlreadyExist] = useState(false)

    const [autocompleteInputValue, setAutocompleteInputValue] = useState(options[0])
    const [selectedFood, setSelectedFood] = useState(options[0])

    const [foodName, setFoodName] = useState('')
    const [serving, setServing] = useState(0)
    const [defaultServing, setDefaultServing] = useState(0)
    const [calories, setCalories] = useState(0)
    const [protein, setProtein] = useState(0)
    const [carbs, setCarbs] = useState(0)
    const [fats, setFats] = useState(0)

    const [renderTrigger, setRenderTrigger] = useState(0)

    // Set food details when selected food changes
    useEffect(() => {
        const food = props.foods.find((food: FoodInterface) => food.name === selectedFood)

        if (food) {
            setFoodName(food.name)
            setServing(1)
            setDefaultServing(food.defaultServing)
            setCalories(food.calories)
            setProtein(food.protein)
            setCarbs(food.carbs)
            setFats(food.fats)
        }
    }, [selectedFood])

    async function handleUpdate() {
        setIsLoading(true)

        try {
            const food = props.foods.find((food: FoodInterface) => food.name === selectedFood)

            if (!food) throw new Error('Food not found')

            const res = await axios.post('/api/updateFood', {
                foodID: food._id,
                name: foodName !== food.name ? foodName : '',
                defaultServing: defaultServing !== food.defaultServing ? defaultServing : -1,
                calories: calories / serving !== food.calories ? calories / serving : -1,
                protein: protein / serving !== food.protein ? protein / serving : -1,
                carbs: carbs / serving !== food.carbs ? carbs / serving : -1,
                fats: fats / serving !== food.fats ? fats / serving : -1,
            })

            if (res.status === 200) {
                props.getAndHandleUserData()
                setSelectedFood(foodName)
            }
        } catch (error: any) {
            if (error.response.data === 'Food already exists.') {
                setIsFoodAlreadyExist(true)
            }

            console.log(error)
        }

        setIsLoading(false)
    }
    
    return (
        <>
            {/* Food Editing */}
            <Grid
                item
                xs={12}
                mb={2}
            >
                <Autocomplete
                    disablePortal
                    options={options}
                    fullWidth   
                    renderInput={(params) => <TextField {...params} label="Food Editing" color="secondary"/>}
                    value={selectedFood}
                    onChange={(_event, newValue) => {
                        setSelectedFood(newValue || options[0])
                        setRenderTrigger(renderTrigger + 1)
                    }}
                    inputValue={autocompleteInputValue}
                    onInputChange={(_event, newInputValue) => {setAutocompleteInputValue(newInputValue)}}
                    isOptionEqualToValue={(options, value) => options.valueOf === value.valueOf}
                />
            </Grid>

            {/* Food Name */}
            <Grid
                item
                xs={12}
            >
                <TextField
                    error={isFoodAlreadyExist}
                    helperText={isFoodAlreadyExist ? 'Food already exists.' : ''}
                    fullWidth 
                    label='Food Name'
                    color="secondary"
                    value={foodName}
                    onChange={(e) => setFoodName(e.target.value)}
                />
            </Grid>

            {/* Serving & Calories */}
            <Grid
                spacing={2}
                container
            >
                <Grid
                    item
                    sm={4}
                    xs={6}
                >
                    <CalculatorTextField
                        label="Serving (g)"
                        renderTrigger={renderTrigger}
                        initialValue={serving}
                        setNumber={(newNumberValue: number) => setServing(newNumberValue)}
                    />
                </Grid>
                <Grid
                    item
                    sm={4}
                    xs={6}
                >
                    <CalculatorTextField
                        label="Default Serving (g)"
                        renderTrigger={renderTrigger}
                        initialValue={defaultServing}
                        setNumber={(newNumberValue: number) => setDefaultServing(newNumberValue)}
                    />
                </Grid>
                <Grid
                    item
                    sm={4}
                    xs={6}
                >
                    <CalculatorTextField
                        label="Calories (kcal)"
                        renderTrigger={renderTrigger}
                        initialValue={calories}
                        setNumber={(newNumberValue: number) => setCalories(newNumberValue)}
                    />
                </Grid>
                <Grid
                    item
                    sm={4}
                    xs={6}
                >
                    <CalculatorTextField
                        label="Protein (g)"
                        renderTrigger={renderTrigger}
                        initialValue={protein}
                        setNumber={(newNumberValue: number) => setProtein(newNumberValue)}
                    />
                </Grid>
                <Grid
                    item
                    sm={4}
                    xs={6}
                >
                    <CalculatorTextField
                        label="Carbs (g)"
                        renderTrigger={renderTrigger}
                        initialValue={carbs}
                        setNumber={(newNumberValue: number) => setCarbs(newNumberValue)}
                    />
                </Grid>
                <Grid
                    item
                    sm={4}
                    xs={6}
                >
                    <CalculatorTextField
                        label="Fats (g)"
                        renderTrigger={renderTrigger}
                        initialValue={fats}
                        setNumber={(newNumberValue: number) => setFats(newNumberValue)}
                    />
                </Grid>
            </Grid>

            <EditFoodDishButtons 
                isLoading={isLoading}
                handleUpdate={handleUpdate}
            />
        </>
    )
}

export default EditFoodForm;