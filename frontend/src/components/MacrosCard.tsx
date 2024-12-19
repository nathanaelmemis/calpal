import { Grid, useMediaQuery, useTheme } from "@mui/material";
import LabeledGauge from "./LabeledGauge";

import { LabeledBorderLinearProgress } from "./LabeledBorderLinearProgress";
import { Macros } from "../interfaces/macros";
import { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../context/UserDataContext";
import { formatNumber } from "../utils/formatNumber";
import { FoodEaten } from "../interfaces/foodEaten";
import { calculateDishMacros } from "../utils/calculateDishMacros";
import { getColorFromValue } from "../utils/getColorFromValue";

interface MacrosCardProps { 
    caloriesIncrease?: number, 
    proteinIncrease?: number, 
    carbsIncrease?: number, 
    fatsIncrease?: number 
}

export function MacrosCard({ caloriesIncrease = 0, proteinIncrease = 0, carbsIncrease = 0, fatsIncrease = 0 }: MacrosCardProps) {
    const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'))

    const {
        userData,
        foods,
        dishes,
        foodEaten,
        dishEaten
    } = useContext(UserDataContext)

    const [totalMacros, setTotalMacros] = useState<Macros>({
        calories: 0,
        carbs: 0,
        protein: 0,
        fats: 0
    })
    
    // Calculate total macros
    useEffect(() => {
        let totalCalories = 0
        let totalCarbs = 0
        let totalProtein = 0
        let totalFats = 0

        foodEaten.forEach((foodEatenItem: FoodEaten) => {
            const foodData = foods.find((foodItem) => foodItem._id === foodEatenItem.foodID)

            if (!foodData) {
                console.error('Food not found:', foodEatenItem)
                return
            }

            totalCalories += foodData.calories * foodEatenItem.grams * foodEatenItem.quantity
            totalCarbs += foodData.carbs * foodEatenItem.grams * foodEatenItem.quantity
            totalProtein += foodData.protein * foodEatenItem.grams * foodEatenItem.quantity
            totalFats += foodData.fats * foodEatenItem.grams * foodEatenItem.quantity
        })

        dishEaten.forEach((dishEatenItem) => {
            const dish = dishes.find((dishItem) => dishItem._id === dishEatenItem.dishID)

            if (!dish) {
                console.error('Dish not found:', dishEatenItem)
                return
            }

            const { calories, carbs, protein, fats } = calculateDishMacros(
                foods, 
                dishes, 
                dishEatenItem.dishID, 
                dishEatenItem.foodServing,
                dishEatenItem.grams,
                dishEatenItem.quantity
            )

            totalCalories += calories
            totalCarbs += carbs
            totalProtein += protein
            totalFats += fats
        })

        setTotalMacros({
            calories: totalCalories, 
            carbs: totalCarbs, 
            protein: totalProtein, 
            fats: totalFats
        })
    }, [foodEaten, dishEaten])

    return (
        <Grid 
            bgcolor={'primary.main'}
            mb={isMobile ? '1.25em' : '2em'}
            display={'flex'}
            justifyContent={'space-evenly'}
            alignItems={'center'}
            container
            sx={{
                boxShadow: 5,
                borderRadius: 5,
                p: {
                    sm: '1em 0',
                    xs: '.5em'
                }
            }}>
            <Grid
                item
                sm={4}
                xs={12}
                display={'flex'}
                justifyContent={'center'}
                sx={{
                    width: {
                        sm: '200px',
                        xs: '180px'
                    },
                    height: {
                        sm: '200px',
                        xs: '150px'
                    },
                    mb: {
                        sm: '0',
                        xs: '1em'
                    }
                }}
            >
                <LabeledGauge 
                    value={(totalMacros.calories + caloriesIncrease) / userData.caloriesLimit}
                    innerText="Calories"
                    bottomText={`${formatNumber(totalMacros.calories + caloriesIncrease)} / ${userData.caloriesLimit} kcal`}
                    color={getColorFromValue(totalMacros.calories + caloriesIncrease, userData.caloriesLimit, useTheme())}
                />
            </Grid>
            <Grid
                item
                sm={2.63}
                xs={4}
                sx={{
                    width: {
                        sm: '150px',
                        xs: 'auto'
                    },
                    height: {
                        sm: '150px',
                        xs: 'auto'
                    },
                }}
                display={'flex'}
                justifyContent={'center'}
            >
                {
                    isMobile ?
                    <LabeledBorderLinearProgress 
                        label="Carbs"
                        value={(totalMacros.carbs + carbsIncrease) / userData.carbsLimit}
                        bottomText={`${formatNumber(totalMacros.carbs + carbsIncrease)} / ${userData.carbsLimit} g`}
                        color={getColorFromValue(totalMacros.carbs + carbsIncrease, userData.carbsLimit, useTheme())}
                    /> :
                    <LabeledGauge 
                        value={(totalMacros.carbs + carbsIncrease) / userData.carbsLimit}
                        innerText="Carbs"
                        bottomText={`${formatNumber(totalMacros.carbs + carbsIncrease)} / ${userData.carbsLimit} g`}
                        color={getColorFromValue(totalMacros.carbs + carbsIncrease, userData.carbsLimit, useTheme())}
                    />
                }
            </Grid>
            <Grid
                item
                sm={2.63}
                xs={4}
                display={'flex'}
                justifyContent={'center'}
                sx={{
                    width: {
                        sm: '150px',
                        xs: 'auto'
                    },
                    height: {
                        sm: '150px',
                        xs: 'auto'
                    },
                }}
            >
                {
                    isMobile ?
                    <LabeledBorderLinearProgress 
                        label="Protein"
                        value={(totalMacros.protein + proteinIncrease) / userData.proteinLimit}
                        bottomText={`${formatNumber(totalMacros.protein + proteinIncrease)} / ${userData.proteinLimit} g`}
                        color={getColorFromValue(totalMacros.protein + proteinIncrease, userData.proteinLimit, useTheme())}
                    /> :
                    <LabeledGauge 
                        value={(totalMacros.protein + proteinIncrease) / userData.proteinLimit}
                        innerText="Protein"
                        bottomText={`${formatNumber(totalMacros.protein + proteinIncrease)} / ${userData.proteinLimit} g`}
                        color={getColorFromValue(totalMacros.protein + proteinIncrease, userData.proteinLimit, useTheme())}
                    />
                }
            </Grid>
            <Grid
                item
                sm={2.63}
                xs={4}
                display={'flex'}
                justifyContent={'center'}
                sx={{
                    width: {
                        sm: '150px',
                        xs: 'auto'
                    },
                    height: {
                        sm: '150px',
                        xs: 'auto'
                    },
                }}
            >
                {
                    isMobile ?
                    <LabeledBorderLinearProgress 
                        label="Fats"
                        value={(totalMacros.fats + fatsIncrease) / userData.fatsLimit}
                        bottomText={`${formatNumber(totalMacros.fats + fatsIncrease)} / ${userData.fatsLimit} g`}
                        color={getColorFromValue(totalMacros.fats + fatsIncrease, userData.fatsLimit, useTheme())}
                    /> :
                    <LabeledGauge 
                        value={(totalMacros.fats + fatsIncrease) / userData.fatsLimit}
                        innerText="Fats"
                        bottomText={`${formatNumber(totalMacros.fats + fatsIncrease)} / ${userData.fatsLimit} g`}
                        color={getColorFromValue(totalMacros.fats + fatsIncrease, userData.fatsLimit, useTheme())}
                    />
                }
            </Grid>
        </Grid>
    )
}