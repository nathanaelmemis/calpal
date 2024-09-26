import { FormControl, Grid, InputLabel, MenuItem, Select, useMediaQuery, useTheme } from "@mui/material";
import { useContext, useState } from "react";
import Header from "../../components/Header";
import EditFoodForm from "./EditFoodForm";
import EditDishForm from "./EditDishForm";
import { checkAuth } from "../../utils/checkAuth";
import { UserDataContext } from "../../context/UserDataContext";
import { Loading } from "../../components/Loading";

function EditFoodDish() {
    const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'))
    // Check if user is authenticated
    if (!checkAuth()) return

    const [category, setCategory] = useState('Food')

    const {
        isFetchingData
    } = useContext(UserDataContext)

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
                                '& input': {
                                    fontSize: {
                                        sm: theme.typography.body1.fontSize,
                                        xs: theme.typography.body2.fontSize
                                    }
                                }
                            })}
                        >
                            <MenuItem value={'Food'}>Food</MenuItem>
                            <MenuItem value={'Dish'}>Dish</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                { category === 'Food' ? <EditFoodForm /> : <EditDishForm /> }
            </Grid>
        </>
    )
}

export default EditFoodDish;