import { Grid, Autocomplete, TextField, useMediaQuery, useTheme } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import EditDishFormFoodRowTextField from "./EditDishFormFoodRowTextField";
import { EditFoodDishButtons } from "./EditFoodDishButtons";
import axios from "axios";
import { Dish } from "../../interfaces/dish";
import { DishFood } from "../../interfaces/dishFood";
import { UserDataContext } from "../../context/UserDataContext";
import { SelectedFoodDish } from "../../interfaces/selectedFoodDish";
import { EditFoodDishDeleteAlertDialog } from "./EditFoodDishDeleteAlertDialog";

function EditDishForm() {
    const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'))
    
    const {
        dishes,
        getData
    } = useContext(UserDataContext)

    const [refreshTrigger, setRefreshTrigger] = useState<string>(Date.now().toFixed())
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isDishAlreadyExist, setIsDishAlreadyExist] = useState<boolean>(false)

    const [autocompleteInputValue, setAutocompleteInputValue] = useState<string>('')
    const [selectedDish, setSelectedDish] = useState<SelectedFoodDish | null>(null)

    const [foodName, setDishName] = useState<string>('')    
    const [defaultServing, setDefaultServing] = useState<number>(1)
    const [dishData, setDishData] = useState<DishFood[]>([])

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)

    // Set food details when selected food changes
    useEffect(() => {
        if (!selectedDish) {
            setDishName('')
            setDefaultServing(1)
            setDishData([])
            setRefreshTrigger(Date.now().toFixed())
            return
        }

        const dish = dishes.find((dish: Dish) => dish._id === selectedDish.id)

        if (dish) {
            setDishName(dish.name)
            setDefaultServing(dish.defaultServing)
            setDishData([...dish.foods])

            setRefreshTrigger(Date.now().toFixed())
        }
    }, [selectedDish])

    async function handleUpdate() {
        setIsLoading(true)

        if (!selectedDish) {
            setIsLoading(false)
            return
        }

        try {
            const dish = dishes.find((dish: Dish) => dish._id === selectedDish.id)

            if (!dish) throw new Error('Dish not found')

            const res = await axios.post('/api/updateDish', {
                dishID: selectedDish.id,
                name: foodName !== dish.name ? foodName : '',
                defaultServing: defaultServing !== dish.defaultServing ? defaultServing : -1,
                foods: dishData.map((dishFood: DishFood) => (dishFood.defaultServing))
            })

            if (res.status === 200) {
                await getData(['dishes', 'dishEaten'])
            }
        } catch (error: any) {
            if (error.response.data === 'Dish already exists.') {
                setIsDishAlreadyExist(true)
            }

            console.log(error)
        }

        setIsLoading(false)
    }

    async function handleDelete() {
        setIsLoading(true)
        setIsDeleteDialogOpen(false)

        if (!selectedDish) {
            setIsLoading(false)
            return
        }

        try {
            const res = await axios.delete('/api/deleteFoodDish', {
                data: {
                    foodDishID: selectedDish.id,
                    isDish: true
                }
            })

            if (res.status === 200) {
                await getData(['dishes', 'dishEaten'])
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }
    
    return (
        <>
            {/* Dish Editing */}
            <Grid
                item
                xs={12}
                sx={{
                    mb: {
                        sm: '1em',
                        xs: '0.5em'
                    }
                }}
            >
                <Autocomplete
                    disablePortal
                    options={dishes.map((option: Dish) => ({name: option.name, id: option._id}))}
                    getOptionLabel={(option) => option.name}
                    fullWidth   
                    renderInput={(params) => <TextField {...params} label="Dish Editing" color="secondary"/>}
                    value={selectedDish}
                    onChange={(_event, newValue) => {setSelectedDish(newValue)}}
                    inputValue={autocompleteInputValue}
                    onInputChange={(_event, newInputValue) => {setAutocompleteInputValue(newInputValue)}}
                    isOptionEqualToValue={(options, value) => options.id.valueOf === value.id.valueOf}
                    size={isMobile ? 'small' : 'medium'}
                    sx={(theme) => ({
                        '& input': {
                            fontSize: {
                                sm: theme.typography.body1.fontSize,
                                xs: theme.typography.body2.fontSize
                            }
                        }
                    })}
                />
            </Grid>

            {/* Dish Name */}
            <Grid
                container
                item
                xs={12}
                spacing={2}
                sx={{
                    mb: {
                        sm: '1em',
                        xs: '0.5em'
                    }
                }}
            >
                <Grid
                    item
                    sm={8}
                    xs={7}
                >
                    <TextField
                        error={isDishAlreadyExist}
                        helperText={isDishAlreadyExist ? 'Dish already exists.' : ''}
                        fullWidth
                        label='Dish Name'
                        color="secondary"
                        value={foodName}
                        onChange={(e) => setDishName(e.target.value)}
                        size={isMobile ? 'small' : 'medium'}
                        sx={(theme) => ({
                            '& input': {
                                fontSize: {
                                    sm: theme.typography.body1.fontSize,
                                    xs: theme.typography.body2.fontSize
                                }
                            }
                        })}
                    />
                </Grid>
                <Grid
                    item
                    sm={4}
                    xs={5}
                >
                    <TextField
                        fullWidth
                        label='Default Serving'
                        color="secondary"
                        value={defaultServing}
                        onChange={(e) => setDefaultServing(parseInt(e.target.value))}
                        size={isMobile ? 'small' : 'medium'}
                        sx={(theme) => ({
                            '& input': {
                                fontSize: {
                                    sm: theme.typography.body1.fontSize,
                                    xs: theme.typography.body2.fontSize
                                }
                            }
                        })}
                    />
                </Grid>
            </Grid>

            {/* Rendering of Dish Foods */}
            {
                dishData.map((food: DishFood, index: number) => (
                    <Grid
                        key={index + refreshTrigger}
                        item
                        xs={12}
                        display={'flex'}
                        alignItems={'center'}
                    >
                        <Grid
                            item
                            sm={1} 
                            xs={0}
                        />
                        <Grid
                            item
                            sm={11}
                            xs={12}
                            columnGap={2}
                            display={'flex'}
                        >   
                            <EditDishFormFoodRowTextField 
                                foodID={food.foodID}
                                defaultServingInitialValue={food.defaultServing}
                                index={index}
                                setDishData={setDishData}
                            />
                        </Grid>
                    </Grid>
                ))
            }
                
            {/* Buttons */}
            <EditFoodDishButtons 
                isLoading={isLoading}
                disabled={!selectedDish}
                handleUpdate={handleUpdate}
                setIsDeleteDialogOpen={setIsDeleteDialogOpen}
            />

            {/* Delete Dialog */}
            {
                !selectedDish ? null : 
                <EditFoodDishDeleteAlertDialog
                    foodDishToDelete={selectedDish.name}
                    open={isDeleteDialogOpen}
                    setOpen={setIsDeleteDialogOpen}
                    handleDelete={handleDelete} 
                />
            }
            
        </>
    )
}

export default EditDishForm;