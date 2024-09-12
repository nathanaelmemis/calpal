import { Button, Grid, IconButton, TextField, useMediaQuery, useTheme } from "@mui/material";
import { AddCircle as AddCircleIcon, RemoveCircle as RemoveCircleIcon} from '@mui/icons-material';
import { DishDataInterface, FoodInterface } from "../Interface";
import { useEffect, useState } from "react";
import CreateDishFormFoodRowTextField from "./CreateDishFormFoodRowTextField";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CreateFoodButtons from "./CreateFoodButtons";
import { CalculatorTextField } from "./CalculatorTextField";

interface CreateDishFormInterface {
    foods: FoodInterface[],
    getAndHandleUserData: Function
}

function CreateDishForm({ foods, getAndHandleUserData }: CreateDishFormInterface) {
    const [renderedDishData, setRenderedDishData]: [Element[], Function] = useState([])
    const [refreshTrigger, setRefreshTrigger] = useState(Date.now().toFixed())
    const [isLoading, setIsLoading] = useState(false)
    const [isFoodAlreadyExist, setIsFoodAlreadyExist] = useState(false)

    const [foodName, setFoodName] = useState('')    
    const [defaultServing, setDefaultServing] = useState(1)
    const [dishData, setDishData]: [DishDataInterface[], Function] = useState([
        { food: '', defaultServing: 1 }
    ])
    
    const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'))
    const navigate = useNavigate()
    
    function handleRemoveButtonOnClick(index: number) {
        const disDataTemp = dishData.filter((_, i) => i !== index)

        if (disDataTemp.length === 0) {
            setDishData([{food: '', defaultServing: 1}])
        } else {
            setDishData(disDataTemp)
        }

        setRefreshTrigger(Date.now().toFixed())
    }

    async function handleCreateButtonClick() {
        setIsLoading(true)

        try {
            const res = await axios.post('/api/createDish', {
                name: foodName,
                defaultServing: defaultServing,
                foods: dishData
            })

            if (res.status === 200) {
                await getAndHandleUserData()
                navigate(-1)
            }
        } catch (error: any) {
            if (error.response.data === 'Dish already exists.') {
                setIsFoodAlreadyExist(true)
            }

            console.log(error)
        }

        setIsLoading(false)
    }

    useEffect(() => {
        setRenderedDishData(dishData.map((food: DishDataInterface, index) => (
            <Grid
                key={index + refreshTrigger}
                item
                xs={12}
                display={'flex'}
                alignItems={'flex-start'}
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
                    <CreateDishFormFoodRowTextField 
                        foods={foods}
                        foodInitialValue={food.food}
                        defaultServingInitialValue={food.defaultServing}
                        index={index}
                        dishData={dishData}
                        setDishData={setDishData}
                    />
                </Grid>
            </Grid>
        )))
    }, [refreshTrigger])

    return (
        <>
            {/* Food/Dish Name */}
            <Grid
                item
                xs={12}
                display={'flex'}
                columnGap={2}
            >
                <Grid
                    item
                    xs={8}
                >
                    <TextField 
                        label={'Dish Name'}
                        color="secondary"
                        fullWidth
                        size={isMobile ? 'small' : 'medium'}
                        value={foodName}
                        error={isFoodAlreadyExist}
                        helperText={isFoodAlreadyExist ? 'Food already exists.' : ''}
                        onChange={(e) => {setFoodName(e.target.value); setIsFoodAlreadyExist(false)}}
                        sx={(theme) => ({
                            '& .MuiInputBase-input': {
                                fontSize: isMobile ? theme.typography.body2.fontSize : theme.typography.body1.fontSize
                            }
                        })}
                    />
                </Grid>
                <Grid
                    item
                    xs={4}
                >
                    <CalculatorTextField
                        label="Default Serving (g)"
                        initialValue={1}
                        setNumber={(newNumberValue: number) => setDefaultServing(newNumberValue)}
                    />
                </Grid>
            </Grid>
            
            {renderedDishData}

            {/* Add Food TextField Button */}
            <Button 
                fullWidth
                color="secondary"
                variant="contained"
                onClick={() => {
                    setDishData((dishData: DishDataInterface[]) => [...dishData, {food: '', defaultServing: 1}])
                    setRefreshTrigger(Date.now().toFixed())
                }}
                sx={{
                    mt: isMobile ? '0' : '1em'
                }}
            >
                <AddCircleIcon 
                    fontSize={isMobile ? 'small' : "medium"}
                />
            </Button>

            <CreateFoodButtons 
                isLoading={isLoading}
                handleCreateButtonClick={handleCreateButtonClick}
            />
        </>
    )
}

export default CreateDishForm;