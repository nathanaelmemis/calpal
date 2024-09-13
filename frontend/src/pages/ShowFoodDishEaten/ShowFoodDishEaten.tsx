import { Box, Divider, Fade, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import Header from "../../components/Header";
import { FoodEatenInterface, DishEatenInterface } from "../../Interface";
import { NavigateButtonCard } from "../../components/NavigateButtonCard";
import { Edit as EditIcon} from '@mui/icons-material';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface CreateFoodInterface {
    userName: string,
    isDataPresent: boolean,
    foodEaten: FoodEatenInterface[],
    dishEaten: DishEatenInterface[],
    setFoodDishEatenEditing: Function,
}

interface ConcatenatedFoodDishEatenInterface extends FoodEatenInterface{
    isDish: boolean
}

export function ShowFoodDishEaten(props: CreateFoodInterface) {
    const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'))
    const navigate = useNavigate()

    // Check if user is authenticated
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
        if (!props.isDataPresent) {
            navigate('/dashboard')
        }
    })

    // Concat food eaten and transformed dish eaten data
    const foodDishEaten = Array<ConcatenatedFoodDishEatenInterface>()
        .concat(
            props.foodEaten.map((foodEatenItem: FoodEatenInterface) => { // add isDish key to food eaten data
                return ( 
                    {
                        ...foodEatenItem,
                        isDish: false
                    }
                )
            }), 
            props.dishEaten.map((dishEatenItem: DishEatenInterface) => { // transform dish eaten data
                return (
                    {
                        _id: dishEatenItem._id,
                        userID: dishEatenItem.userID,
                        mealType: dishEatenItem.mealType,
                        date: dishEatenItem.date,
                        food: dishEatenItem.dish,
                        grams: dishEatenItem.grams,
                        quantity: dishEatenItem.quantity,
                        isDish: true
                    }
                )
            })
        )
        .sort((a: ConcatenatedFoodDishEatenInterface, b: ConcatenatedFoodDishEatenInterface) => { // Sort by date latest to oldest
            return new Date(b.date).getTime() - new Date(a.date).getTime()
        })

    return (
        <>
            <Header userName={props.userName}/>

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
                    foodDishEaten.length === 0 ? 
                    <Box 
                        width={'100%'}
                        display={'flex'}
                        justifyContent={'center'}
                        alignItems={'center'}
                    >
                        <Typography>You haven't eaten yet.</Typography>
                    </Box> :
                    foodDishEaten.map((food: ConcatenatedFoodDishEatenInterface) => {
                        const [isHovered, setIsHovered] = useState(false);
                        
                        return (
                            <Grid 
                                key={food.food} 
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
                                    props.setFoodDishEatenEditing(food._id, food.isDish)
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
                                    >{food.food}</Typography>
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
                                    >{isMobile ? food.mealType[0] : food.mealType}</Typography>
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
                                    >{food.grams}</Typography>
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
                                    >{food.quantity}</Typography>
                                </Grid>
                            </Grid>
                        )
                    })
                }
            </Grid>
        </>
    )
}