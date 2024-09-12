import { FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { DishInterface, FoodInterface } from "../Interface";
import axios from "axios";
import EditFoodForm from "../components/EditFoodForm";
import EditDishForm from "../components/EditDishForm";

interface CreateFoodInterface {
    userName: string,
    isDataPresent: boolean,
    getAndHandleUserData: () => void,
    foods: FoodInterface[],
    dishes: DishInterface[]
}

function EditFoodDish(props: CreateFoodInterface) {
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
        if (!props.isDataPresent) {
            navigate('/dashboard')
        }
    })

    return (
        <>
            <Header userName={props.userName}/>
            
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
                        >
                            <MenuItem value={'Food'}>Food</MenuItem>
                            <MenuItem value={'Dish'}>Dish</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                {
                    category === 'Food' ? 
                        <EditFoodForm
                            getAndHandleUserData={props.getAndHandleUserData}
                            foods={props.foods}
                        /> : 
                        <EditDishForm
                            getAndHandleUserData={props.getAndHandleUserData}
                            foods={props.foods}
                            dishes={props.dishes}
                        />
                }
            </Grid>
        </>
    )
}

export default EditFoodDish;