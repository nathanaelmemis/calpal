import { Grid, Autocomplete, TextField, useMediaQuery, useTheme } from "@mui/material"
import { SyntheticEvent, useState } from "react"
import { DishInterface, FoodInterface } from "../../Interface"
import { CalculatorTextField } from "../../components/CalculatorTextField"

interface AddFoodDishTextFieldProps {
    setIsDish: Function
    foods: FoodInterface[]
    dishes: DishInterface[]
    selectedFood: string
    setSelectedFood: Function
    grams: number
    setGrams: Function
    quantity: number
    setQuantity: Function
    setMacrosIncrease: (calories: number, protein: number, carbs: number, fats: number, grams: number, quantity: number) => void
    setMealCaloriesIncrease: Function
    isError: boolean
    setIsError: Function
    renderTrigger: number
    setRenderTrigger: Function
}

function AddFoodDishTextField({ setIsDish, foods, dishes, selectedFood, setSelectedFood, grams, setGrams, quantity, setQuantity, setMacrosIncrease, setMealCaloriesIncrease, isError, setIsError, renderTrigger, setRenderTrigger}: AddFoodDishTextFieldProps) {
    const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'))
    
    const [autocompleteInputValue, setAutocompleteInputValue] = useState('')

    function HandleOnChangeAutocomplete(_event: SyntheticEvent<Element, Event>, value: string | null) {
        const food = foods.find(food => food.name === value)
        const dish = dishes.find(dish => dish.name === value)

        if (dish) {
            setIsDish(true)
            
        } else if (food) {
            setIsDish(false)
        }

        setRenderTrigger(renderTrigger + 1)
        
        setGrams(food?.defaultServing || 0)
        setSelectedFood(value || '')
        setMacrosIncrease((food || dish)?.calories || 0, (food || dish)?.protein || 0, (food || dish)?.carbs || 0, (food || dish)?.fats || 0, grams, quantity)
        setMealCaloriesIncrease((food?.calories || 0) * grams * quantity)
        setIsError(false)
    }

    return (
        <>
            <Grid 
                xs={5.5}
                item
            >
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={foods.map((option) => option.name).concat(dishes.map((option) => option.name))}
                    fullWidth   
                    renderInput={(params) => <TextField {...params} label="Food" color="secondary" error={isError} helperText={isError ? "No food given." : ""}/>}
                    value={selectedFood}
                    inputValue={autocompleteInputValue}
                    onChange={HandleOnChangeAutocomplete}
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
                xs={3}
                item
            >
                <CalculatorTextField 
                    label="Grams"
                    renderTrigger={renderTrigger}
                    initialValue={grams}
                    setNumber={(newNumberValue: number) => setGrams(newNumberValue)} 
                />
            </Grid>
            <Grid
                xs={3}
                item
            >
                <CalculatorTextField 
                    label="Quantity"
                    renderTrigger={renderTrigger}
                    initialValue={quantity}
                    setNumber={(newNumberValue: number) => setQuantity(newNumberValue)} 
                />
            </Grid>
        </>
    )
}

export default AddFoodDishTextField