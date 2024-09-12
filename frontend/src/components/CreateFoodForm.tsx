import { Grid, TextField, useMediaQuery, useTheme } from "@mui/material";
import { FoodDataInterface } from "../Interface";
import { useState } from "react";
import CreateFoodButtons from "./CreateFoodButtons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CalculatorTextField } from "./CalculatorTextField";

interface CreateFoodFormInterface {
    getAndHandleUserData: Function
}

function CreateFoodForm({ getAndHandleUserData }: CreateFoodFormInterface) {
    const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'))
    
    const [foodName, setFoodName] = useState('')
    const [isFoodAlreadyExist, setIsFoodAlreadyExist] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const navigate = useNavigate()

    // Food
    const [foodData, setFoodData]: [FoodDataInterface, Function] = useState({
        serving: 1,
        defaultServing: 1,
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0
    })

    async function handleCreateButtonClick() {
        setIsLoading(true)

        try {
            const res = await axios.post('/api/createFood', {
                name: foodName,
                defaultServing: foodData.defaultServing,
                calories: foodData.calories / foodData.serving,
                protein: foodData.protein / foodData.serving,
                carbs: foodData.carbs / foodData.serving,
                fats: foodData.fats / foodData.serving,
            })

            if (res.status === 200) {
                await getAndHandleUserData()
                navigate(-1)
            }
        } catch (error: any) {
            if (error.response.data === 'Food already exists.') {
                setIsFoodAlreadyExist(true)
            }

            console.log(error)
        }

        setIsLoading(false)
    }

    return(
        <>
            {/* Food/Dish Name */}
            <Grid
                item
                xs={12}
            >
                <TextField 
                    label={'Food Name'}
                    color="secondary"
                    fullWidth
                    value={foodName}
                    error={isFoodAlreadyExist}
                    helperText={isFoodAlreadyExist ? 'Food already exists.' : ''}
                    onChange={(e) => {setFoodName(e.target.value); setIsFoodAlreadyExist(false)}}
                    size={isMobile ? 'small' : 'medium'}
                    sx={(theme) => ({
                        '& input': {
                            fontSize: isMobile ? theme.typography.body2.fontSize : theme.typography.body1.fontSize
                        }
                    })}
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
                        initialValue={1}
                        setNumber={(newNumberValue: number) => setFoodData((foodData: FoodDataInterface) => ({...foodData, serving: newNumberValue}))}
                    />
                </Grid>
                <Grid
                    item
                    sm={4}
                    xs={6}
                >
                    <CalculatorTextField
                        label="Default Serving (g)"
                        initialValue={1}
                        setNumber={(newNumberValue: number) => setFoodData((foodData: FoodDataInterface) => ({...foodData, defaultServing: newNumberValue}))}
                    />
                </Grid>
                <Grid
                    item
                    sm={4}
                    xs={6}
                >
                    <CalculatorTextField
                        label="Calories (kcal)"
                        initialValue={0}
                        setNumber={(newNumberValue: number) => setFoodData((foodData: FoodDataInterface) => ({...foodData, calories: newNumberValue}))}
                    />
                </Grid>
                <Grid
                    item
                    sm={4}
                    xs={6}
                >
                    <CalculatorTextField
                        label="Protein (g)"
                        initialValue={0}
                        setNumber={(newNumberValue: number) => setFoodData((foodData: FoodDataInterface) => ({...foodData, protein: newNumberValue}))}
                    />
                </Grid>
                <Grid
                    item
                    sm={4}
                    xs={6}
                >
                    <CalculatorTextField
                        label="Carbs (g)"
                        initialValue={0}
                        setNumber={(newNumberValue: number) => setFoodData((foodData: FoodDataInterface) => ({...foodData, carbs: newNumberValue}))}
                    />
                </Grid>
                <Grid
                    item
                    sm={4}
                    xs={6}
                >
                    <CalculatorTextField
                        label="Fats (g)"
                        initialValue={0}
                        setNumber={(newNumberValue: number) => setFoodData((foodData: FoodDataInterface) => ({...foodData, fats: newNumberValue}))}
                    />
                </Grid>
            </Grid>

            <CreateFoodButtons 
                isLoading={isLoading}
                handleCreateButtonClick={handleCreateButtonClick}
            />
        </>
    )
}

export default CreateFoodForm;