import { Autocomplete, Grid, TextField, useMediaQuery, useTheme } from "@mui/material";
import { Dispatch, SetStateAction, SyntheticEvent, useContext, useState } from "react";
import { CalculatorTextField } from "../../components/CalculatorTextField";
import { Food } from "../../interfaces/food";
import { UserDataContext } from "../../context/UserDataContext";
import { DishFood } from "../../interfaces/dishFood";
import { SelectedFoodDish } from "../../interfaces/selectedFoodDish";

interface CreateDishFormFoodRowTextFieldProps {
    initialValueFoodID: string,
    defaultServingInitialValue: number,
    index: number,
    dishData: DishFood[],
    setDishData: Dispatch<SetStateAction<DishFood[]>>
}

export function CreateDishFormFoodRowTextField({ initialValueFoodID, defaultServingInitialValue, index, dishData, setDishData }: CreateDishFormFoodRowTextFieldProps) {
    const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'))

    const {
        foods
    } = useContext(UserDataContext)

    const food = foods.find((food: Food) => food._id === initialValueFoodID)

    if (!food && initialValueFoodID !== '') {
        console.error('Food not found:', initialValueFoodID)
    }
    
    const [autocompleteInputValue, setAutocompleteInputValue] = useState(food?.name || '')
    const [selectedFood, setSelectedFood] = useState<SelectedFoodDish>({name: food?.name || '', id: food?._id || ''})

    function handleOnChangeAutocomplete(_event: SyntheticEvent<Element, Event>, value: SelectedFoodDish | null) {
        if (!value) {
            setSelectedFood({name: '', id: ''})
            return
        }

        setSelectedFood(value)

        const dishDataTemp = [...dishData]
        dishDataTemp[index] = {foodID: value.id, defaultServing: defaultServingInitialValue}

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
                    options={foods.map((option) => {return {name: option.name, id: option._id}})}
                    getOptionLabel={(option) => option.name}
                    fullWidth   
                    renderInput={(params) => <TextField {...params} label="Food" color="secondary"/>}
                    value={selectedFood}
                    onChange={handleOnChangeAutocomplete}
                    inputValue={autocompleteInputValue}
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
                item
                xs={4.28}
            >
                <CalculatorTextField
                    label="Default Serving (g)"
                    initialValue={defaultServingInitialValue}
                    setNumber={(newNumberValue: number) => {
                        setDishData((dishData: DishFood[]) => {
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