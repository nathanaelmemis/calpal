import { Box, Divider, Fade, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import Header from "../../components/Header";
import { NavigateButtonCard } from "../../components/NavigateButtonCard";
import { Edit as EditIcon} from '@mui/icons-material';
import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DishEaten } from "../../interfaces/dishEaten";
import { FoodEaten } from "../../interfaces/foodEaten";
import { checkAuth } from "../../utils/checkAuth";
import { UserDataContext } from "../../context/UserDataContext";

interface ConcatenatedFoodDishEaten{
    id: string
    name: string
    mealType: string
    date: string
    grams: number
    quantity: number
    isDish: boolean
}

export function ShowFoodDishEaten() {
    // Check if user is authenticated
    if (!checkAuth()) return

    const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'))
    const navigate = useNavigate()

    const {
        foods,
        dishes,
        foodEaten,
        dishEaten,
        setFoodDishEatenEditing
    } = useContext(UserDataContext)

    /**
     * TODO: This algorithm can be optimized from O(n^2) to O(n) by using _id of foods and dishes as keys.
     * - although this will be a time consuming refactor because foods and dishes are used in many components.
     * - this is a temporary solution for now.
     */
    // Concat food eaten and transformed dish eaten data
    const foodDishEaten = useRef<Array<ConcatenatedFoodDishEaten>>()
    foodDishEaten.current = Array<ConcatenatedFoodDishEaten>()
        .concat(
            foodEaten.map((foodEatenItem: FoodEaten) => { // add isDish key to food eaten data
                const food = foods.find((food) => food._id === foodEatenItem.foodID)

                if (!food) {
                    console.error('Food not found')
                    return {
                        id: foodEatenItem._id, 
                        name: 'Food not found', 
                        mealType: '', date: '', grams: 0, quantity: 0, isDish: false
                    }
                }

                return ( 
                    {
                        id: foodEatenItem._id,
                        name: food?.name,
                        mealType: foodEatenItem.mealType,
                        date: foodEatenItem.date,
                        grams: foodEatenItem.grams,
                        quantity: foodEatenItem.quantity,
                        isDish: false
                    }
                )
            }), 
            dishEaten.map((dishEatenItem: DishEaten) => { // transform dish eaten data
                const dish = dishes.find((dish) => dish._id === dishEatenItem.dishID)

                if (!dish) {
                    console.error('Dish not found')
                    return {
                        id: dishEatenItem._id, 
                        name: 'Dish not found', 
                        mealType: '', date: '', grams: 0, quantity: 0, isDish: true
                    }
                }

                return (
                    {
                        id: dishEatenItem._id,
                        name: dish.name,
                        mealType: dishEatenItem.mealType,
                        date: dishEatenItem.date,
                        grams: dishEatenItem.grams,
                        quantity: dishEatenItem.quantity,
                        isDish: true
                    }
                )
            })
        )
        .sort((a: ConcatenatedFoodDishEaten, b: ConcatenatedFoodDishEaten) => { // Sort by date latest to oldest
            return new Date(b.date).getTime() - new Date(a.date).getTime()
        })

    return (
        <>
            <Header />

            <NavigateButtonCard 
                text={'Show Food Metrics'} 
                route={'/dashboard'} 
                arrowIconDirection={'down'}
            />

            <Grid
                bgcolor={'primary.main'}
                p={isMobile ? '0 0 1em 0' : '1em'}
                mb={'2em'}
                sx={{
                    boxShadow: 5,
                    borderRadius: 5
                }}
            >
                <Grid
                    container
                    display={'flex'}
                    p={isMobile ? '1em .25em' : '1em'}
                >
                    <Grid
                        item
                        xs={.5}
                    />
                    <Grid
                        item
                        xs={5.5}
                        display={'flex'}
                        justifyContent={'center'}
                    >
                        <Typography 
                            fontWeight={'bold'}
                            sx={(theme) => ({
                                fontSize: { 
                                    sm: theme.typography.body1.fontSize, 
                                    xs: theme.typography.body2.fontSize 
                                },
                            })}
                        >Name</Typography>
                    </Grid>
                    <Grid
                        item
                        xs={2}
                        display={'flex'}
                        justifyContent={'center'}
                    >
                        <Typography fontWeight={'bold'}
                            sx={(theme) => ({
                                fontSize: { 
                                    sm: theme.typography.body1.fontSize, 
                                    xs: theme.typography.body2.fontSize 
                                },
                            })}
                        >Meal</Typography>
                    </Grid>
                    <Grid
                        item
                        xs={2}
                        display={'flex'}
                        justifyContent={'center'}
                    >
                        <Typography fontWeight={'bold'}
                            sx={(theme) => ({
                                fontSize: { 
                                    sm: theme.typography.body1.fontSize, 
                                    xs: theme.typography.body2.fontSize 
                                },
                            })}
                        >{isMobile ? 'g' : 'Grams'}</Typography>
                    </Grid>
                    <Grid
                        item
                        xs={2}
                        display={'flex'}
                        justifyContent={'center'}
                    >
                        <Typography fontWeight={'bold'}
                            sx={(theme) => ({
                                fontSize: { 
                                    sm: theme.typography.body1.fontSize, 
                                    xs: theme.typography.body2.fontSize 
                                },
                            })}
                        >{isMobile ? 'Qty.' : 'Quantity'}</Typography>
                    </Grid>
                </Grid>

                <Divider sx={{ mb: '1.5em', borderColor: 'rgba(0, 0, 0, 0.2)' }} />

                {
                    foodDishEaten.current.length === 0 ? 
                    <Box 
                        width={'100%'}
                        display={'flex'}
                        justifyContent={'center'}
                        alignItems={'center'}
                    >
                        <Typography>You haven't eaten yet.</Typography>
                    </Box> :
                    foodDishEaten.current.map((foodDishEatenItem: ConcatenatedFoodDishEaten) => {
                        const [isHovered, setIsHovered] = useState(false);
                        
                        return (
                            <Grid 
                                key={foodDishEatenItem.name} 
                                container
                                display={'flex'}
                                my={'.5em'}
                                bgcolor={'white'}
                                p={isMobile ? '1em .25em' : '1em'}
                                borderTop={'1px solid rgba(0, 0, 0, 0.2)'}
                                borderBottom={'1px solid rgba(0, 0, 0, 0.2)'}
                                borderLeft={isMobile ? 'none' : '1px solid rgba(0, 0, 0, 0.2)'}
                                borderRight={isMobile ? 'none' : '1px solid rgba(0, 0, 0, 0.2)'}
                                sx={{
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        boxShadow: 3,
                                        border: '1px solid rgba(0, 0, 0, 0.5)'
                                    }
                                }}
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                                onClick={() => {
                                    setFoodDishEatenEditing({foodDishEatenEditingID: foodDishEatenItem.id, isDish: foodDishEatenItem.isDish})
                                    navigate('/editFoodEaten')
                                }}
                            >
                                <Grid
                                    item
                                    xs={.5}
                                    display={'flex'}
                                    justifyContent={'center'}
                                    alignItems={'center'}
                                >
                                    <Fade in={isHovered} timeout={200}>
                                        <EditIcon fontSize="small"/>
                                    </Fade>
                                </Grid>
                                <Grid
                                    item
                                    xs={5.5}
                                    display={'flex'}
                                    justifyContent={'center'}
                                >
                                    <Typography
                                        noWrap
                                        sx={(theme) => ({
                                            fontSize: { 
                                                sm: theme.typography.body1.fontSize, 
                                                xs: theme.typography.body2.fontSize 
                                            },
                                        })}
                                    >{foodDishEatenItem.name}</Typography>
                                </Grid>
                                <Grid
                                    item
                                    xs={2}
                                    display={'flex'}
                                    justifyContent={'center'}
                                >
                                    <Typography
                                        sx={(theme) => ({
                                            fontSize: { 
                                                sm: theme.typography.body1.fontSize, 
                                                xs: theme.typography.body2.fontSize 
                                            },
                                        })}
                                    >
                                        {isMobile 
                                            ? foodDishEatenItem.mealType[0].toUpperCase()
                                            : foodDishEatenItem.mealType[0].toUpperCase() + foodDishEatenItem.mealType.slice(1)
                                        }
                                    </Typography>
                                </Grid>
                                <Grid
                                    item
                                    xs={2}
                                    display={'flex'}
                                    justifyContent={'center'}
                                >
                                    <Typography
                                        sx={(theme) => ({
                                            fontSize: { 
                                                sm: theme.typography.body1.fontSize, 
                                                xs: theme.typography.body2.fontSize 
                                            },
                                        })}
                                    >{foodDishEatenItem.grams}</Typography>
                                </Grid>
                                <Grid
                                    item
                                    xs={2}
                                    display={'flex'}
                                    justifyContent={'center'}
                                >
                                    <Typography
                                        sx={(theme) => ({
                                            fontSize: { 
                                                sm: theme.typography.body1.fontSize, 
                                                xs: theme.typography.body2.fontSize 
                                            },
                                        })}
                                    >{foodDishEatenItem.quantity}</Typography>
                                </Grid>
                            </Grid>
                        )
                    })
                }
            </Grid>
        </>
    )
}