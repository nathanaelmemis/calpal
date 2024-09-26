import { Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useContext, useState } from "react";

import Header from "../../components/Header";
import { AddFoodCard } from "./AddFoodCard";
import { MacrosCard } from "../../components/MacrosCard";

import { AddDishCard } from "./AddDishCard";
import { formatNumber } from "../../utils/formatNumber";
import { UserDataContext } from "../../context/UserDataContext";
import { Loading } from "../../components/Loading";
import { checkAuth } from "../../utils/checkAuth";
import { SelectedFoodDish } from "../../interfaces/selectedFoodDish";
import { Macros } from "../../interfaces/macros";

function AddFoodDish() {
    // Check if user is authenticated
    if (!checkAuth()) return
    
    const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'))

    const {
        isFetchingData
    } = useContext(UserDataContext)
    
    const [caloriesIncrease, setCaloriesIncrease] = useState<number>(0)
    const [proteinIncrease, setProteinIncrease] = useState<number>(0)
    const [carbsIncrease, setCarbsIncrease] = useState<number>(0)
    const [fatsIncrease, setFatsIncrease] = useState<number>(0)

    const [selectedFoodDish, setSelectedFoodDish] = useState<SelectedFoodDish>({name: '', id: ''})

    const [isDish, setIsDish] = useState(false)

    function setMacrosIncrease(macros: Macros) {
        setCaloriesIncrease(macros.calories)
        setCarbsIncrease(macros.carbs)
        setProteinIncrease(macros.protein)
        setFatsIncrease(macros.fats)
    }

    return (
        isFetchingData ? <Loading /> :
        <>
            <Header />
            
            <MacrosCard 
                caloriesIncrease={caloriesIncrease}
                proteinIncrease={proteinIncrease}
                carbsIncrease={carbsIncrease}
                fatsIncrease={fatsIncrease}
            />

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
                    >+{formatNumber(fatsIncrease)} g</Typography>
                </Grid>
            </Grid>

            {
                isDish ? <AddDishCard 
                    setIsDish={setIsDish}
                    selectedFoodDish={selectedFoodDish}
                    setSelectedFoodDish={setSelectedFoodDish}
                    setMacrosIncrease={setMacrosIncrease}
                /> : <AddFoodCard 
                    setIsDish={setIsDish}
                    selectedFoodDish={selectedFoodDish}
                    setSelectedFoodDish={setSelectedFoodDish}
                    setMacrosIncrease={setMacrosIncrease}
                />
            }
        </>
    );
}

export default AddFoodDish;