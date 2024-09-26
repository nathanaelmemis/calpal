import { Grid, Autocomplete, TextField, useMediaQuery, useTheme } from "@mui/material"
import { CalculatorTextField } from "../../components/CalculatorTextField"
import { SetStateAction, useState, SyntheticEvent, Dispatch, useContext } from "react"
import { UserDataContext } from "../../context/UserDataContext"
import { SelectedFoodDish } from "../../interfaces/selectedFoodDish"
import { Macros } from "../../interfaces/macros"
import { calculateDishMacros } from "../../utils/calculateDishMacros"

interface AddFoodDishTextFieldProps {
    setIsDish: Dispatch<SetStateAction<boolean>>
    selectedFoodDish: SelectedFoodDish
    setSelectedFoodDish: Dispatch<SetStateAction<SelectedFoodDish>>
    grams: number
    setGrams: Dispatch<SetStateAction<number>>
    quantity: number
    setQuantity: Dispatch<SetStateAction<number>>
    setMacrosIncrease: (macros: Macros) => void
    setMealCaloriesIncrease: Dispatch<SetStateAction<number>>
    isError: boolean
    setIsError: Dispatch<SetStateAction<boolean>>
    renderTrigger: number
}

function AddFoodDishTextField({ setIsDish, selectedFoodDish, setSelectedFoodDish, grams, setGrams, quantity, setQuantity, setMacrosIncrease, setMealCaloriesIncrease, isError, setIsError, renderTrigger}: AddFoodDishTextFieldProps) {
    const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'))

    const [autocompleteInputValue, setAutocompleteInputValue] = useState('')

    const {
        foods,
        dishes,
    } = useContext(UserDataContext)

    function handleOnChangeAutocomplete(_event: SyntheticEvent<Element, Event>, value: SelectedFoodDish | null) {
        if (!value) {
            setIsDish(false)
            setGrams(0)
            setQuantity(1)
            setSelectedFoodDish({name: '', id: ''})
            setMacrosIncrease({calories: 0, protein: 0, carbs: 0, fats: 0})
            setMealCaloriesIncrease(0)
            setIsError(false)
            return
        }

        const food = foods.find(food => food._id === value.id)
        const dish = dishes.find(dish => dish._id === value.id)

        if (food && dish) {
            console.error('Food and dish id collision:', food, dish)
            setIsError(true)
            return
        }

        if (dish) {
            setIsDish(true)
            setGrams(dish.defaultServing)
            setSelectedFoodDish(value)
            const dishMacros = 
                {...calculateDishMacros(
                    foods,
                    dishes,
                    value.id, 
                    dish.foods.map((dishFood) => dishFood.defaultServing), 
                    grams,
                    quantity
                )}
            setMacrosIncrease(dishMacros)
            setMealCaloriesIncrease(dishMacros.calories)
        } else if (food) {
            setIsDish(false)
            setGrams(food.defaultServing)
            setSelectedFoodDish(value)
            setMacrosIncrease({
                calories: food.calories * grams * quantity,
                carbs: food.carbs * grams * quantity,
                protein: food.protein * grams * quantity,
                fats: food.fats  * grams * quantity,
            })
            setMealCaloriesIncrease((food.calories) * grams * quantity)
        } else {
            console.error('Food or dish not found:', value)
            setIsError(true)
            return
        }

        setIsError(false)
    }

    return (
        <Grid
            container
            spacing={2}
        >
            <Grid 
                sm={5.5}
                xs={12}
                item
            >
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={foods.map((option) => {return {name: option.name, id: option._id}}).concat(dishes.map((option) => {return {name: option.name, id: option._id}}))}
                    getOptionLabel={(option) => option.name}
                    fullWidth   
                    renderInput={(params) => <TextField {...params} label="Food" color="secondary" error={isError} helperText={isError ? "No food given." : ""}/>}
                    value={selectedFoodDish}
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
                xs={6}
                sm={3.25}
                item
            >
                <CalculatorTextField 
                    label="Grams"
                    renderTrigger={renderTrigger}
                    initialValue={grams}
                    setNumber={setGrams} 
                />
            </Grid>
            <Grid
                xs={6}
                sm={3.25}
                item
            >
                <CalculatorTextField 
                    label="Quantity"
                    renderTrigger={renderTrigger}
                    initialValue={quantity}
                    setNumber={setQuantity} 
                />
            </Grid>
        </Grid>
    )
}

export default AddFoodDishTextField