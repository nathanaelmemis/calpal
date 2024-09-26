import { Grid, TextField, useMediaQuery, useTheme } from "@mui/material";
import { Dispatch, SetStateAction, useContext } from "react";
import { CalculatorTextField } from "../../components/CalculatorTextField";
import { DishFood } from "../../interfaces/dishFood";
import { Food } from "../../interfaces/food";
import { UserDataContext } from "../../context/UserDataContext";

interface EditDishFormFoodRow { 
    foodID: string
    defaultServingInitialValue: number,
    index: number,
    setDishData: Dispatch<SetStateAction<DishFood[]>>
}

function EditDishFormFoodRowTextField({ foodID, defaultServingInitialValue, index, setDishData}: EditDishFormFoodRow) {
    const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'))
    const {
        foods
    } = useContext(UserDataContext)

    const food = foods.find((food: Food) => food._id === foodID)

    if (!food) {
        console.error(`Food not found: ${foodID}`)
    }

    return (
        <>
            <Grid
                item
                sm={8}
                xs={7}
            >
                <TextField 
                    fullWidth
                    value={food?.name || ''}
                    size={isMobile ? 'small' : 'medium'}
                    sx={(theme) => ({
                        pointerEvents: 'none',
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'rgba(0, 0, 0, 0.12)',
                            }
                        },
                        '& input': {
                            fontSize: {
                                sm: theme.typography.body1.fontSize,
                                xs: theme.typography.body2.fontSize
                            }
                        }
                    })}
                />
            </Grid>
            <Grid
                item
                sm={4}
                xs={5}
            >
                <CalculatorTextField
                    label="Serving (g/ratio)"
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

export default EditDishFormFoodRowTextField;