import { Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useState } from "react";

import Header from "../components/Header";
import { AddFoodCard } from "../components/AddFoodCard";
import { MacrosCard } from "../components/MacrosCard";

import { DishInterface, FoodInterface, MealsDishEatenInterface, MealsFoodEatenInterface, TotalMacrosInterface, UserDataInterface } from "../Interface";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AddDishCard from "../components/AddDishCard";

interface AddFoodInterface {
    isDataPresent: boolean,
    getAndHandleUserData: Function,
    userData: UserDataInterface,
    mealType: string,
    foods: FoodInterface[],
    dishes: DishInterface[],
    mealsFoodEaten: MealsFoodEatenInterface,
    mealsDishEaten: MealsDishEatenInterface,
    totalMacros: TotalMacrosInterface
}

function AddFoodDish({ isDataPresent, getAndHandleUserData, userData, mealType, foods, dishes, mealsFoodEaten, mealsDishEaten, totalMacros }: AddFoodInterface) {
    const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'))
    
    const [tempTotalMacros, setTempTotalMacros] = useState(totalMacros)
    const [caloriesIncrease, setCaloriesIncrease] = useState(0)
    const [proteinIncrease, setProteinIncrease] = useState(0)
    const [carbsIncrease, setCarbsIncrease] = useState(0)
    const [fatIncrease, setFatIncrease] = useState(0)

    const [selectedFood, setSelectedFood] = useState('')

    const [isDish, setIsDish] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        async function checkAuth() {
            try {
                const res = await axios.post('/api/authenticate')
    
                if (res.status !== 200) {
                    navigate('/login')
                }
            } catch (error) {
                console.log(error)
                navigate('/login')
                return
            }
        }

        checkAuth()
    }, [])

    // Get user data
    useEffect(() => {
        if (!isDataPresent) {
            navigate('/dashboard')
        }
    })
 
    // Update temp total macros when increase in macros changes
    useEffect(() => {
        setTempTotalMacros({
            calories: totalMacros.calories + caloriesIncrease,
            protein: totalMacros.protein + proteinIncrease,
            carbs: totalMacros.carbs + carbsIncrease,
            fats: totalMacros.fats + fatIncrease
        })
    }, [caloriesIncrease, proteinIncrease, carbsIncrease, fatIncrease])

    // Round off to nearest hundredth
    function formatNumber(num: number) {
        return Math.ceil(num * 100) / 100
    }

    function setMacrosIncrease(calories: number, protein: number, carbs: number, fats: number, grams: number, quantity: number) {
        setCaloriesIncrease((calories) * grams * quantity)
        setProteinIncrease((protein) * grams * quantity)
        setCarbsIncrease((carbs) * grams * quantity)
        setFatIncrease((fats) * grams * quantity)
    }

    return (
        <>
            <Header userName={userData.name}/>
            
            <MacrosCard userData={userData} totalMacros={tempTotalMacros}/>

            {/* Increase Meter */}
            <Grid
                container
                bgcolor={'primary.main'}
                display={'flex'}
                mb={isMobile ? '1.25em' : '2em'}
                justifyContent={'space-evenly'}
                sx={{
                    boxShadow: 5,
                    borderRadius: 5,
                    py: {
                        sm: '1em',
                        xs: '.75em'
                    }
                }}
            >
                <Grid 
                    item
                    xs={4}
                >
                    {
                        !isMobile ? '' :
                        <Typography 
                            width={'100%'}
                            textAlign={'center'}
                            variant="body2"
                        >
                            Calories
                        </Typography> 
                    }
                    <Typography 
                        width={'100%'}
                        textAlign={'center'}
                        sx={(theme) => ({
                            fontSize: {
                                sm: theme.typography.body1.fontSize,
                                xs: theme.typography.body2.fontSize
                            }
                        })}
                    >+{formatNumber(caloriesIncrease)} kcal</Typography>
                </Grid>
                <Grid 
                    item
                    xs={2.63}
                >
                    {
                        !isMobile ? '' :
                        <Typography 
                            width={'100%'}
                            textAlign={'center'}
                            variant="body2"
                        >
                            Protein
                        </Typography> 
                    }
                    <Typography 
                        width={'100%'}
                        textAlign={'center'}
                        sx={(theme) => ({
                            fontSize: {
                                sm: theme.typography.body1.fontSize,
                                xs: theme.typography.body2.fontSize
                            }
                        })}
                    >+{formatNumber(proteinIncrease)} g</Typography>
                </Grid>
                <Grid 
                    item
                    xs={2.63}
                >
                    {
                        !isMobile ? '' :
                        <Typography 
                            width={'100%'}
                            textAlign={'center'}
                            variant="body2"
                        >
                            Carbs
                        </Typography> 
                    }
                    <Typography 
                        width={'100%'}
                        textAlign={'center'}
                        sx={(theme) => ({
                            fontSize: {
                                sm: theme.typography.body1.fontSize,
                                xs: theme.typography.body2.fontSize
                            }
                        })}
                    >+{formatNumber(carbsIncrease)} g</Typography>
                </Grid>
                <Grid 
                    item
                    xs={2.63}
                >
                    {
                        !isMobile ? '' :
                        <Typography 
                            width={'100%'}
                            textAlign={'center'}
                            variant="body2"
                        >
                            Fats
                        </Typography> 
                    }
                    <Typography 
                        width={'100%'}
                        textAlign={'center'}
                        sx={(theme) => ({
                            fontSize: {
                                sm: theme.typography.body1.fontSize,
                                xs: theme.typography.body2.fontSize
                            }
                        })}
                    >+{formatNumber(fatIncrease)} g</Typography>
                </Grid>
            </Grid>

            {
                isDish ? <AddDishCard 
                    getAndHandleUserData={getAndHandleUserData}
                    userData={userData}
                    mealType={mealType}
                    setIsDish={setIsDish}
                    selectedFood={selectedFood}
                    setSelectedFood={setSelectedFood}
                    foods={foods}
                    dishes={dishes}
                    mealsFoodEaten={mealsFoodEaten}
                    mealsDishEaten={mealsDishEaten}
                    setMacrosIncrease={setMacrosIncrease}
                /> : <AddFoodCard 
                    getAndHandleUserData={getAndHandleUserData}
                    userData={userData}
                    mealType={mealType}
                    setIsDish={setIsDish}
                    selectedFood={selectedFood}
                    setSelectedFood={setSelectedFood}
                    foods={foods}
                    dishes={dishes}
                    mealsFoodEaten={mealsFoodEaten}
                    mealsDishEaten={mealsDishEaten}
                    setMacrosIncrease={setMacrosIncrease}
                />
            }
        </>
    );
}

export default AddFoodDish;