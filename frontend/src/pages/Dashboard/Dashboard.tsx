import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
    Grid, 
    Divider, 
    Typography, 
    IconButton, 
    Tooltip, 
    useMediaQuery,
    useTheme
} from "@mui/material";
import { Gauge, gaugeClasses } from "@mui/x-charts";

import { Add as AddIcon } from "@mui/icons-material";

import { MacrosCard } from "../../components/MacrosCard";
import Header from "../../components/Header";
import { NavigateButtonCard } from "../../components/NavigateButtonCard";
import { UserDataContext } from "../../context/UserDataContext";
import { Loading } from "../../components/Loading";
import { checkAuth } from "../../utils/checkAuth";
import { FoodEaten } from "../../interfaces/foodEaten";
import { DishEaten } from "../../interfaces/dishEaten";
import { calculateDishMacros } from "../../utils/calculateDishMacros";

export function Dashboard() {
    // Check if user is authenticated
    if (!checkAuth()) return
    
    const { 
        isFetchingData,
        userData,
        foods,
        dishes,
        foodEaten,
        dishEaten, 
        setMealType
    } = useContext(UserDataContext)
    
    const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'))

    const [breakfastCalories, setBreakfastCalories] = useState(0)
    const [lunchCalories, setLunchCalories] = useState(0)
    const [snacksCalories, setSnacksCalories] = useState(0)
    const [dinnerCalories, setDinnerCalories] = useState(0)

    // Get food eaten data
    useEffect(() => {
        function calculateMealFoodCalories(meal: FoodEaten[]) {
            return meal.reduce((acc: number, mealItem: FoodEaten) => {
                const food = foods.find((food) => food._id === mealItem.foodID)

                if (!food) {
                    console.error('Food not found:', mealItem)
                    return acc
                }

                return acc + food.calories * mealItem.grams * mealItem.quantity
            }, 0)
        }

        const calculateMealDishCalories = (meal: DishEaten[]) => {
            return meal.reduce((acc: number, mealItem: DishEaten) => {
                const dishMacros = calculateDishMacros(foods, dishes, mealItem.dishID, mealItem.foodServing, mealItem.grams, mealItem.quantity)

                return acc + dishMacros.calories
            }, 0)
        }

        // Group food eaten by meal type
        const foodEatenBreakfast = foodEaten.filter((item: FoodEaten) => item.mealType === "breakfast")
        const foodEatenLunch = foodEaten.filter((item: FoodEaten) => item.mealType === "lunch")
        const foodEatenSnacks = foodEaten.filter((item: FoodEaten) => item.mealType === "snacks")
        const foodEatenDinner = foodEaten.filter((item: FoodEaten) => item.mealType === "dinner")

        // Group dish eaten by meal type
        const dishEatenBreakfast = dishEaten.filter((item: DishEaten) => item.mealType === "breakfast")
        const dishEatenLunch = dishEaten.filter((item: DishEaten) => item.mealType === "lunch")
        const dishEatenSnacks = dishEaten.filter((item: DishEaten) => item.mealType === "snacks")
        const dishEatenDinner = dishEaten.filter((item: DishEaten) => item.mealType === "dinner")

        setBreakfastCalories(calculateMealFoodCalories(foodEatenBreakfast) + calculateMealDishCalories(dishEatenBreakfast))
        setLunchCalories(calculateMealFoodCalories(foodEatenLunch) + calculateMealDishCalories(dishEatenLunch))
        setSnacksCalories(calculateMealFoodCalories(foodEatenSnacks) + calculateMealDishCalories(dishEatenSnacks))
        setDinnerCalories(calculateMealFoodCalories(foodEatenDinner) + calculateMealDishCalories(dishEatenDinner))
    }, [foodEaten, dishEaten])

    return (
        isFetchingData ? <Loading /> :
        <>
            <Header />
            
            {/* Macro Meter Section */}
            <MacrosCard />

            {/* Meals Section */}
            <Grid
                bgcolor={'primary.main'}
                p={'1em'}
                mb={isMobile ? '1.25em' : '2em'}
                sx={{
                    boxShadow: 5,
                    borderRadius: 5
                }}>
                <MealGuage 
                    width={isMobile ? 80 : 100}
                    value={breakfastCalories/userData.breakfastCaloriesLimit}
                    mealType="Breakfast"
                    setMealType={setMealType}
                    calories={breakfastCalories}
                    caloriesLimit={userData.breakfastCaloriesLimit}/>
                <Divider sx={{ my: { sm: '.5em', xs: '.25em'} }}/>
                <MealGuage 
                    width={isMobile ? 80 : 100}
                    value={lunchCalories/userData.lunchCaloriesLimit}
                    mealType="Lunch"
                    setMealType={setMealType}
                    calories={lunchCalories}
                    caloriesLimit={userData.lunchCaloriesLimit}/>
                <Divider sx={{ my: { sm: '.5em', xs: '.25em'} }}/>
                <MealGuage 
                    width={isMobile ? 80 : 100}
                    value={snacksCalories/userData.snacksCaloriesLimit}
                    mealType="Snacks"
                    setMealType={setMealType}
                    calories={snacksCalories}
                    caloriesLimit={userData.snacksCaloriesLimit}/>
                <Divider sx={{ my: { sm: '.5em', xs: '.25em'} }}/>
                <MealGuage 
                    width={isMobile ? 80 : 100}
                    value={dinnerCalories/userData.dinnerCaloriesLimit}
                    mealType="Dinner"
                    setMealType={setMealType}
                    calories={dinnerCalories}
                    caloriesLimit={userData.dinnerCaloriesLimit}/>
            </Grid>
            
            <NavigateButtonCard 
                text="Show Food Eaten"
                route="/showFoodEaten"
                arrowIconDirection="up"
            />
        </>
    )
}


interface MealGuageProps {
    width: number;
    value: number;
    mealType: string;
    setMealType: Function;
    calories: number;
    caloriesLimit: number;
}

function MealGuage({ width, value, mealType, setMealType, calories, caloriesLimit }: MealGuageProps) {
    const navigate = useNavigate();
    const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'))

    function validateValue(value: number) {
        if (isNaN(value)) {
            return 0
        } else if (value > 1) {
            return 100
        } else {
            return value * 100
        }
    }

    // Round off to nearest hundredth
    function formatNumber(num: number) {
        return Math.ceil(num * 100) / 100
    }

    return (
        <Grid
            display={'flex'}
            justifyContent={'space-between'}
        >
            {/* Left Section */}
            <Grid
                display={'flex'}
                justifyContent={'flex-start'}
            >
                <Gauge 
                    width={width} 
                    height={width} 
                    value={validateValue(value)}
                    cornerRadius={50}
                    text={''}
                    sx={(theme) => ({
                        mr: isMobile ? '.25em' : '1em',
                        flexGrow: 0,
                        [`& .${gaugeClasses.valueText}`]: {
                            fontSize: theme.typography.h6.fontSize,
                            fontFamily: theme.typography.fontFamily,
                            fontWeight: 'bold',
                        },
                        [`& .${gaugeClasses.valueArc}`]: {
                            fill: `${validateValue(value) === 100 ? theme.palette.error.main : theme.palette.secondary.main}`,
                        },
                    })}
                />
                <Grid
                    display={'flex'}
                    flexDirection={'column'}
                    justifyContent={'center'}
                >
                    <Typography 
                        sx={{ 
                            mb: {
                                sm: '.5em',
                                xs: '0'
                            },
                            fontWeight: 'bold',
                        }}
                        variant={isMobile ? 'body2' : 'body1'}
                    >
                        {mealType}
                    </Typography>
                    <Typography
                        variant={isMobile ? 'body2' : 'body1'}
                    >{`${formatNumber(calories)} / ${caloriesLimit} g`}</Typography>
                </Grid>
            </Grid>
                        
            {/* Right Section */}
            <Grid
                display={'flex'}
                justifyContent={'center'}
                alignItems={'center'}
                mr={isMobile ? '0' : '1em'}
            >
                <Tooltip 
                    title='Add Food'    
                    sx={{
                        fontSize: '1.5em'
                    }}
                    slotProps={{
                        popper: {
                            modifiers: [
                                {
                                    name: 'offset',
                                    options: {
                                        offset: [0, -10],
                                    },
                                }
                            ]
                        }
                    }}
                >
                    <IconButton 
                        size='large' 
                        color='secondary'
                        onClick={() => {setMealType(mealType.toLowerCase()); navigate(`/addFood`)}}>
                        <AddIcon />
                    </IconButton>
                </Tooltip>
            </Grid>
        </Grid>
    );
}