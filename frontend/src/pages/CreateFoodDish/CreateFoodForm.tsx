import { Grid, TextField, useMediaQuery, useTheme } from "@mui/material";
import { useContext, useState } from "react";
import { CreateFoodDishButtons } from "./CreateFoodDishButtons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CalculatorTextField } from "../../components/CalculatorTextField";
import { FoodData } from "../../interfaces/foodData";
import { UserDataContext } from "../../context/UserDataContext";

function CreateFoodForm() {
    const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'))

    const {
        getData
    } = useContext(UserDataContext)
    
    const [foodName, setFoodName] = useState('')
    const [isFoodAlreadyExist, setIsFoodAlreadyExist] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const navigate = useNavigate()

    // Food
    const [foodData, setFoodData]: [FoodData, Function] = useState({
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
                await getData(['foods'])
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
                        setNumber={(newNumberValue: number) => setFoodData((foodData: FoodData) => ({...foodData, serving: newNumberValue}))}
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
                        setNumber={(newNumberValue: number) => setFoodData((foodData: FoodData) => ({...foodData, defaultServing: newNumberValue}))}
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
                        setNumber={(newNumberValue: number) => setFoodData((foodData: FoodData) => ({...foodData, calories: newNumberValue}))}
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
                        setNumber={(newNumberValue: number) => setFoodData((foodData: FoodData) => ({...foodData, carbs: newNumberValue}))}
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
                        setNumber={(newNumberValue: number) => setFoodData((foodData: FoodData) => ({...foodData, protein: newNumberValue}))}
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
                        setNumber={(newNumberValue: number) => setFoodData((foodData: FoodData) => ({...foodData, fats: newNumberValue}))}
                    />
                </Grid>
            </Grid>

            <CreateFoodDishButtons 
                isLoading={isLoading}
                handleCreateButtonClick={handleCreateButtonClick}
            />
        </>
    )
}

export default CreateFoodForm;