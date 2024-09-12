import { Button, Grid, TextField, Typography, useMediaQuery, useTheme } from "@mui/material"
import Header from "../components/Header"
import { UserDataInterface } from "../Interface"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import { LoadingButton } from "@mui/lab"

interface SettingsProps {
    isDataPresent: boolean
    getAndHandleUserData: () => void
    userData: UserDataInterface
}

export function UserDataSettings(props: SettingsProps) {
    const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'))
    const navigate = useNavigate()

    const [name, setName] = useState(props.userData.name)

    const [caloriesLimit, setCaloriesLimit] = useState(props.userData.caloriesLimit)
    const [proteinLimit, setProteinLimit] = useState(props.userData.proteinLimit)
    const [carbsLimit, setCarbsLimit] = useState(props.userData.carbsLimit)
    const [fatsLimit, setFatsLimit] = useState(props.userData.fatsLimit)

    const [breakfastCaloriesLimit, setBreakfastCaloriesLimit] = useState(props.userData.breakfastCaloriesLimit)
    const [lunchCaloriesLimit, setLunchCaloriesLimit] = useState(props.userData.lunchCaloriesLimit)
    const [snacksCaloriesLimit, setSnacksCaloriesLimit] = useState(props.userData.snacksCaloriesLimit)
    const [dinnerCaloriesLimit, setDinnerCaloriesLimit] = useState(props.userData.dinnerCaloriesLimit)

    const [isLoading, setIsLoading] = useState(false)

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

    async function handleSave() {
        setIsLoading(true)

        try {
            const res = await axios.post('/api/updateUserData', {
                name: name !== props.userData.name ? name : '',
                caloriesLimit: caloriesLimit !== props.userData.caloriesLimit ? caloriesLimit : -1,
                proteinLimit: proteinLimit !== props.userData.proteinLimit ? proteinLimit : -1,
                carbsLimit: carbsLimit !== props.userData.carbsLimit ? carbsLimit : -1,
                fatsLimit: fatsLimit !== props.userData.fatsLimit ? fatsLimit : -1,
                breakfastCaloriesLimit: breakfastCaloriesLimit !== props.userData.breakfastCaloriesLimit ? breakfastCaloriesLimit : -1,
                lunchCaloriesLimit: lunchCaloriesLimit !== props.userData.lunchCaloriesLimit ? lunchCaloriesLimit : -1,
                snacksCaloriesLimit: snacksCaloriesLimit !== props.userData.snacksCaloriesLimit ? snacksCaloriesLimit : -1,
                dinnerCaloriesLimit: dinnerCaloriesLimit !== props.userData.dinnerCaloriesLimit ? dinnerCaloriesLimit : -1
            })

            if (res.status === 200) {
                await props.getAndHandleUserData()
                navigate('/dashboard')
            }
        } catch (error) {
            console.error(error)
        }

        setIsLoading(false)
    }
    
    return (
        <>
            <Header userName={props.userData.name}/>

            <Grid
                container
                bgcolor={'primary.main'}
                p={'1em'}
                gap={2}
                sx={{
                    boxShadow: 5,
                    borderRadius: 5
                }}
            >
                {/* Title */}
                <Grid
                    item
                    xs={12}
                    display={'flex'}
                    justifyContent={'center'}
                >
                    <Typography 
                        variant={isMobile ? 'h5' : "h4"}
                        fontWeight={'bold'}
                        color={'secondary.main'}
                    >
                        User Data Settings
                    </Typography>
                </Grid>

                {/* Name */}
                <Grid
                    item
                    xs={12}
                >
                    <TextField 
                        color="secondary"
                        label={'Name'}
                        value={name}
                        fullWidth
                        onChange={(e) => setName(e.target.value)}
                        size={isMobile ? 'small' : 'medium'}
                        sx={(theme) => ({
                            fontSize: {
                                xs: theme.typography.body2.fontSize,
                                sm: theme.typography.body1.fontSize
                            }
                        })}
                    />
                </Grid>

                {/* Macros Limit */}
                <Grid
                    container
                    spacing={2}
                >
                    <Grid
                        item
                        xs={12}
                        display={'flex'}
                        justifyContent={'center'}
                        alignItems={'center'}
                    >
                        <Typography 
                            variant={isMobile ? 'body1' : "h6"}
                            fontWeight={'bold'}
                            color={'secondary.main'}
                        >
                            Macros Limit
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        sm={3}
                        xs={6}
                    >
                        <TextField 
                            color="secondary"
                            label={'Calories Limit'}
                            value={caloriesLimit}
                            fullWidth
                            onChange={(e) => setCaloriesLimit(parseInt(e.target.value))}
                            size={isMobile ? 'small' : 'medium'}
                            sx={(theme) => ({
                                fontSize: {
                                    xs: theme.typography.body2.fontSize,
                                    sm: theme.typography.body1.fontSize
                                }
                            })}
                        />
                    </Grid>
                    <Grid
                        item
                        sm={3}
                        xs={6}
                    >
                        <TextField 
                            color="secondary"
                            label={'Protein Limit'}
                            value={proteinLimit}
                            fullWidth 
                            onChange={(e) => setProteinLimit(parseInt(e.target.value))}
                            size={isMobile ? 'small' : 'medium'}
                            sx={(theme) => ({
                                fontSize: {
                                    xs: theme.typography.body2.fontSize,
                                    sm: theme.typography.body1.fontSize
                                }
                            })}
                        />
                    </Grid>
                    <Grid
                        item
                        sm={3}
                        xs={6}
                    >
                        <TextField 
                            color="secondary"
                            label={'Carbs Limit'}
                            value={carbsLimit}
                            fullWidth
                            onChange={(e) => setCarbsLimit(parseInt(e.target.value))}
                            size={isMobile ? 'small' : 'medium'}
                            sx={(theme) => ({
                                fontSize: {
                                    xs: theme.typography.body2.fontSize,
                                    sm: theme.typography.body1.fontSize
                                }
                            })}
                        />
                    </Grid>
                    <Grid
                        item
                        sm={3}
                        xs={6}
                    >
                        <TextField 
                            color="secondary"
                            label={'Fats Limit'}
                            value={fatsLimit}
                            fullWidth
                            onChange={(e) => setFatsLimit(parseInt(e.target.value))}
                            size={isMobile ? 'small' : 'medium'}
                            sx={(theme) => ({
                                fontSize: {
                                    xs: theme.typography.body2.fontSize,
                                    sm: theme.typography.body1.fontSize
                                }
                            })}
                        />
                    </Grid>
                </Grid>

                {/* Meal Calories Limit */}
                <Grid
                    container
                    spacing={2}
                >
                    <Grid
                        item
                        xs={12}
                        display={'flex'}
                        justifyContent={'center'}
                        alignItems={'center'}
                    >
                        <Typography 
                            variant={isMobile ? 'body1' : "h6"}
                            fontWeight={'bold'}
                            color={'secondary.main'}
                        >
                            Meal Calories Limit
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        sm={3}
                        xs={6}
                    >
                        <TextField 
                            color="secondary"
                            label={'Breakfast Limit'}
                            value={breakfastCaloriesLimit}
                            fullWidth
                            onChange={(e) => setBreakfastCaloriesLimit(parseInt(e.target.value))}
                            size={isMobile ? 'small' : 'medium'}
                            sx={(theme) => ({
                                fontSize: {
                                    xs: theme.typography.body2.fontSize,
                                    sm: theme.typography.body1.fontSize
                                }
                            })}
                        />
                    </Grid>
                    <Grid
                        item
                        sm={3}
                        xs={6}
                    >
                        <TextField 
                            color="secondary"
                            label={'Lunch Limit'}
                            value={lunchCaloriesLimit}
                            fullWidth 
                            onChange={(e) => setLunchCaloriesLimit(parseInt(e.target.value))}
                            size={isMobile ? 'small' : 'medium'}
                            sx={(theme) => ({
                                fontSize: {
                                    xs: theme.typography.body2.fontSize,
                                    sm: theme.typography.body1.fontSize
                                }
                            })}
                        />
                    </Grid>
                    <Grid
                        item
                        sm={3}
                        xs={6}
                    >
                        <TextField 
                            color="secondary"
                            label={'Snacks Limit'}
                            value={snacksCaloriesLimit}
                            fullWidth
                            onChange={(e) => setSnacksCaloriesLimit(parseInt(e.target.value))}
                            size={isMobile ? 'small' : 'medium'}
                            sx={(theme) => ({
                                fontSize: {
                                    xs: theme.typography.body2.fontSize,
                                    sm: theme.typography.body1.fontSize
                                }
                            })}
                        />
                    </Grid>
                    <Grid
                        item
                        sm={3}
                        xs={6}
                    >
                        <TextField 
                            color="secondary"
                            label={'Dinner Limit'}
                            value={dinnerCaloriesLimit}
                            fullWidth
                            onChange={(e) => setDinnerCaloriesLimit(parseInt(e.target.value))}
                            size={isMobile ? 'small' : 'medium'}
                            sx={(theme) => ({
                                fontSize: {
                                    xs: theme.typography.body2.fontSize,
                                    sm: theme.typography.body1.fontSize
                                }
                            })}
                        />
                    </Grid>
                </Grid>

                {/* Buttons */}
                <Grid
                    container
                    display={'flex'}
                    justifyContent={'flex-end'}
                    mt={isMobile ? 0 : 1}
                >
                    <Button
                        variant="contained"
                        color="error"
                        sx={{ mr: 2 }}
                        onClick={() => navigate('/dashboard')}
                        size={isMobile ? 'small' : 'medium'}
                    >
                        Cancel
                    </Button>
                    <LoadingButton
                        loading={isLoading}
                        variant="contained"
                        color="secondary"
                        onClick={() => handleSave()}   
                        size={isMobile ? 'small' : 'medium'}
                    >
                        Save
                    </LoadingButton>
                </Grid>
            </Grid>
        </>
    )
}