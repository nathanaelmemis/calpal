import { FormControl, Grid, InputLabel, MenuItem, Select, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import CreateFoodForm from "../components/CreateFoodForm";
import { FoodInterface } from "../Interface";
import CreateDishForm from "../components/CreateDishForm";
import axios from "axios";

interface CreateFoodInterface {
    userName: string,
    isDataPresent: boolean,
    getAndHandleUserData: Function,
    foods: FoodInterface[],
}

function CreateFoodDish({ userName, isDataPresent, getAndHandleUserData, foods }: CreateFoodInterface) {
    const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'))
    const navigate = useNavigate()

    const [category, setCategory] = useState('Food')

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
        if (!isDataPresent) {
            navigate('/dashboard')
        }
    })

    return (
        <>
            <Header userName={userName}/>
            
            <Grid
                container
                bgcolor={'primary.main'}
                p={'1em'}
                display={'flex'}
                mb={'2em'}
                rowGap={2}
                sx={{
                    boxShadow: 5,
                    borderRadius: 5
                }}
            >
                {/* Category */}
                <Grid
                    item
                    xs={4}
                >
                    <FormControl fullWidth>
                        <InputLabel 
                            id="demo-simple-select-label"
                            color="secondary"
                        >
                            Category
                        </InputLabel>
                        <Select
                            color="secondary"
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={category}
                            label="Category"
                            onChange={(e) => setCategory(e.target.value)}
                            size={isMobile ? 'small' : 'medium'}
                            sx={(theme) => ({
                                fontSize: isMobile ? theme.typography.body2.fontSize : theme.typography.body1.fontSize
                            })}
                        >
                            <MenuItem value={'Food'}>Food</MenuItem>
                            <MenuItem value={'Dish'}>Dish</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                {
                    category === 'Food' ? 
                        <CreateFoodForm
                            getAndHandleUserData={getAndHandleUserData}   
                        /> : 
                        <CreateDishForm 
                            foods={foods}
                            getAndHandleUserData={getAndHandleUserData}
                        />
                }
            </Grid>
        </>
    )
}

export default CreateFoodDish;