import { useEffect, useState } from "react";
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

import { MacrosCard } from "../components/MacrosCard";
import Header from "../components/Header";

import { 
    DetailedDishEatenInterface, 
    DetailedFoodEatenInterface, 
    MealsDishEatenInterface, 
    MealsFoodEatenInterface, 
    TotalMacrosInterface, 
    UserDataInterface 
} from "../Interface";
import { NavigateButtonCard } from "../components/NavigateButtonCard";

interface DashboardInterface {
    isDataPresent: boolean,
    getAndHandleUserData: Function,
    userData: UserDataInterface,
    setMealType: Function,
    mealsFoodEaten: MealsFoodEatenInterface,
    mealsDishEaten: MealsDishEatenInterface,
    totalMacros: TotalMacrosInterface,
}

export function Dashboard({ 
        isDataPresent, 
        getAndHandleUserData, 
        userData, 
        setMealType, 
        mealsFoodEaten, 
        mealsDishEaten, 
        totalMacros 
    }: DashboardInterface) 
{
    const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'))

    const [breakfastCalories, setBreakfastCalories] = useState(0)
    const [lunchCalories, setLunchCalories] = useState(0)
    const [snacksCalories, setSnacksCalories] = useState(0)
    const [dinnerCalories, setDinnerCalories] = useState(0)

    // Get user data
    useEffect(() => {
        if (!isDataPresent) {
            getAndHandleUserData()
        }
    }, [])

    // Get food eaten data
    useEffect(() => {
        function calculateMealCalories(meal: DetailedFoodEatenInterface[] | DetailedDishEatenInterface[]) {
            return meal.reduce((acc: number, item: any) => acc + item.calories * item.grams * item.quantity, 0)
        }

        setBreakfastCalories(calculateMealCalories(mealsFoodEaten.breakfast) + calculateMealCalories(mealsDishEaten.breakfast))
        setLunchCalories(calculateMealCalories(mealsFoodEaten.lunch) + calculateMealCalories(mealsDishEaten.lunch))
        setSnacksCalories(calculateMealCalories(mealsFoodEaten.snacks) + calculateMealCalories(mealsDishEaten.snacks))
        setDinnerCalories(calculateMealCalories(mealsFoodEaten.dinner) + calculateMealCalories(mealsDishEaten.dinner))
    }, [mealsFoodEaten])

    return (
        <>
            <Header userName={userData.name}/>
            
            {/* Macro Meter Section */}
            <MacrosCard 
                userData={userData} 
                totalMacros={totalMacros}
            />

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
                        onClick={() => {setMealType(mealType); navigate(`/addFood`)}}>
                        <AddIcon />
                    </IconButton>
                </Tooltip>
            </Grid>
        </Grid>
    );
}