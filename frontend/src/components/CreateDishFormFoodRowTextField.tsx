import { Autocomplete, Grid, TextField, useMediaQuery, useTheme } from "@mui/material";
import { DishDataInterface, FoodInterface } from "../Interface";
import { SyntheticEvent, useState } from "react";
import { CalculatorTextField } from "./CalculatorTextField";

interface CreateDishFormFoodRowInterface { 
    foods: FoodInterface[],
    foodInitialValue: string,
    defaultServingInitialValue: number,
    index: number,
    dishData: DishDataInterface[],
    setDishData: Function
}

function CreateDishFormFoodRowTextField({ foods, foodInitialValue, defaultServingInitialValue, index, dishData, setDishData }: CreateDishFormFoodRowInterface) {
    const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'))
    
    const [autocompleteInputValue, setAutocompleteInputValue] = useState(foodInitialValue)
    const [selectedFood, setSelectedFood] = useState(foodInitialValue)

    function HandleOnChangeAutocomplete(_event: SyntheticEvent<Element, Event>, value: string | null) {
        setSelectedFood(value || '')

        const dishDataTemp = [...dishData]
        dishDataTemp[index].food = value || ''

        setDishData(dishDataTemp)
    }
    
    return (
        <>
            <Grid
                item
                xs={7.47}
            >
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={foods.map((option: FoodInterface) => option.name)}
                    fullWidth   
                    renderInput={(params) => <TextField {...params} label="Food" color="secondary"/>}
                    value={selectedFood}
                    onChange={HandleOnChangeAutocomplete}
                    inputValue={autocompleteInputValue}
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
                item
                xs={4.28}
            >
                <CalculatorTextField
                    label="Default Serving (g)"
                    initialValue={defaultServingInitialValue}
                    setNumber={(newNumberValue: number) => {
                        setDishData((dishData: DishDataInterface[]) => {
                            const dishDataTemp = [...dishData]
                            dishDataTemp[index].defaultServing = newNumberValue
                            return dishDataTemp
                        })
                    }}
                />
            </Grid>
        </>
    )
}

export default CreateDishFormFoodRowTextField;