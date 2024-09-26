import { FormControl, Grid, InputLabel, MenuItem, Select, useMediaQuery, useTheme } from "@mui/material";
import { useContext, useState } from "react";
import Header from "../../components/Header";
import CreateFoodForm from "./CreateFoodForm";
import { CreateDishForm } from "./CreateDishForm";
import { checkAuth } from "../../utils/checkAuth";
import { UserDataContext } from "../../context/UserDataContext";
import { Loading } from "../../components/Loading";

export function CreateFoodDish() {
    // Check if user is authenticated
    if (!checkAuth()) return

    const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'))

    const {
        isFetchingData,
    } = useContext(UserDataContext)

    const [category, setCategory] = useState('Food')

    return (
        isFetchingData ? <Loading /> :
        <>
            <Header />
            
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

                { category === 'Food' ? <CreateFoodForm /> : <CreateDishForm /> }
            </Grid>
        </>
    )
}