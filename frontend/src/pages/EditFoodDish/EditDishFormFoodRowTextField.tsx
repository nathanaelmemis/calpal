import { Autocomplete, Grid, TextField } from "@mui/material";
import { DishDataInterface, DishFoodInterface, FoodInterface } from "../../Interface";
import { SyntheticEvent, useState } from "react";
import { CalculatorTextField } from "../../components/CalculatorTextField";

interface EditDishFormFoodRowInterface { 
    foods: FoodInterface[],
    foodInitialValue: string,
    defaultServingInitialValue: number,
    index: number,
    dishData: DishFoodInterface[],
    setDishData: Function
}

function EditDishFormFoodRowTextField(props: EditDishFormFoodRowInterface) {
    const [autocompleteInputValue, setAutocompleteInputValue] = useState(props.foodInitialValue)
    const [selectedFood, setSelectedFood] = useState(props.foodInitialValue)

    function HandleOnChangeAutocomplete(_event: SyntheticEvent<Element, Event>, value: string | null) {
        setSelectedFood(value || '')

        const dishDataTemp = [...props.dishData]
        dishDataTemp[props.index].food = value || ''

        props.setDishData(dishDataTemp)
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
                    options={props.foods.map((option: FoodInterface) => option.name)}
                    fullWidth   
                    renderInput={(params) => <TextField {...params} label="Food" color="secondary"/>}
                    value={selectedFood}
                    onChange={HandleOnChangeAutocomplete}
                    inputValue={autocompleteInputValue}
                    onInputChange={(_event, newInputValue) => {setAutocompleteInputValue(newInputValue)}}
                    isOptionEqualToValue={(options, value) => options.valueOf === value.valueOf}
                />
            </Grid>
            <Grid
                item
                xs={4.28}
            >
                <CalculatorTextField
                    label="Serving (g)"
                    initialValue={props.defaultServingInitialValue}
                    setNumber={(newNumberValue: number) => {
                        props.setDishData((dishData: DishDataInterface[]) => {
                            const dishDataTemp = [...dishData]
                            dishDataTemp[props.index].serving = newNumberValue
                            return dishDataTemp
                        })
                    }}
                />
            </Grid>
        </>
    )
}

export default EditDishFormFoodRowTextField;