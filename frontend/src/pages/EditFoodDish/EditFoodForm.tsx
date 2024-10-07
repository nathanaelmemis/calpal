import { Autocomplete, Grid, TextField, useMediaQuery, useTheme } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { EditFoodDishButtons } from "./EditFoodDishButtons";
import axios from "axios";
import { CalculatorTextField } from "../../components/CalculatorTextField";
import { Food } from "../../interfaces/food";
import { UserDataContext } from "../../context/UserDataContext";
import { SelectedFoodDish } from "../../interfaces/selectedFoodDish";
import { EditFoodDishDeleteAlertDialog } from "./EditFoodDishDeleteAlertDialog";

function EditFoodForm() {
    const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'))
    
    const {
        foods,
        getData
    } = useContext(UserDataContext)

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isFoodAlreadyExist, setIsFoodAlreadyExist] = useState<boolean>(false)

    const [autocompleteInputValue, setAutocompleteInputValue] = useState<string>('')
    const [selectedFood, setSelectedFood] = useState<SelectedFoodDish | null>(null)

    const [foodName, setFoodName] = useState<string>('')
    const [serving, setServing] = useState(1)
    const [defaultServing, setDefaultServing] = useState(1)
    const [calories, setCalories] = useState(0)
    const [protein, setProtein] = useState(0)
    const [carbs, setCarbs] = useState(0)
    const [fats, setFats] = useState(0)

    const [renderTrigger, setRenderTrigger] = useState(0)

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)

    // Set food details when selected food changes
    useEffect(() => {
        if (!selectedFood) {
            setFoodName('')
            setServing(1)
            setDefaultServing(1)
            setCalories(0)
            setProtein(0)
            setCarbs(0)
            setFats(0)
            setRenderTrigger(renderTrigger + 1)
            return
        }
        const food = foods.find((food: Food) => food._id === selectedFood.id)

        if (!food && selectedFood.id !== '') {
            console.error('Food not found:', selectedFood)
        }

        setFoodName(food?.name || '')
        setServing(1)
        setDefaultServing(food?.defaultServing || 1)
        setCalories(food?.calories || 0)
        setProtein(food?.protein || 0)
        setCarbs(food?.carbs || 0)
        setFats(food?.fats || 0)

        setRenderTrigger(renderTrigger + 1)
    }, [selectedFood])

    async function handleUpdate() {
        setIsLoading(true)

        if (!selectedFood) {
            setIsLoading(false)
            return
        }

        try {
            const food = foods.find((food: Food) => food._id === selectedFood.id)

            if (!food) throw new Error('Food not found')

            const res = await axios.post('/api/updateFood', {
                foodID: food._id,
                name: foodName !== food.name ? foodName : '',
                defaultServing: defaultServing !== food.defaultServing ? defaultServing : -1,
                calories: calories / serving !== food.calories ? calories / serving : -1,
                protein: protein / serving !== food.protein ? protein / serving : -1,
                carbs: carbs / serving !== food.carbs ? carbs / serving : -1,
                fats: fats / serving !== food.fats ? fats / serving : -1,
            })

            if (res.status === 200) {
                getData(['foods', 'dishes', 'foodEaten', 'dishEaten'])
                setSelectedFood(selectedFood)
            }
        } catch (error: any) {
            if (error.response.data === 'Food already exists.') {
                setIsFoodAlreadyExist(true)
            }

            console.log(error)
        }

        setIsLoading(false)
    }

    async function handleDelete() {
        setIsLoading(true)
        setIsDeleteDialogOpen(false)

        if (!selectedFood) {
            setIsLoading(false)
            return
        }

        try {
            const res = await axios.delete('/api/deleteFoodDish', {
                data: {
                    foodDishID: selectedFood.id,
                    isDish: false
                }
            })

            if (res.status === 200) {
                await getData(['foods', 'dishes', 'foodEaten', 'dishEaten'])
                setSelectedFood(selectedFood)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }
    
    return (
        <>
            {/* Food Editing */}
            <Grid
                item
                xs={12}
                mb={isMobile ? 1 : 2}
            >
                <Autocomplete
                    disablePortal
                    options={foods.map((option: Food) => ({name: option.name, id: option._id}))}
                    getOptionLabel={(option) => option.name}
                    fullWidth   
                    renderInput={(params) => <TextField {...params} label="Food Editing" color="secondary"/>}
                    value={selectedFood}
                    onChange={(_event, newValue) => {
                        setSelectedFood(newValue)
                        setRenderTrigger(renderTrigger + 1)
                    }}
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

            {/* Food Name */}
            <Grid
                item
                xs={12}
            >
                <TextField
                    error={isFoodAlreadyExist}
                    helperText={isFoodAlreadyExist ? 'Food already exists.' : ''}
                    fullWidth 
                    label='Food Name'
                    color="secondary"
                    value={foodName}
                    onChange={(e) => setFoodName(e.target.value)}
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

            {/* Serving & Calories */}
            <Grid
                spacing={2}
                container
            >
                <Grid
                    item
                    sm={4}
                    xs={6}
                >
                    <CalculatorTextField
                        label="Serving (g)"
                        renderTrigger={renderTrigger}
                        initialValue={serving}
                        setNumber={(newNumberValue: number) => setServing(newNumberValue)}
                    />
                </Grid>
                <Grid
                    item
                    sm={4}
                    xs={6}
                >
                    <CalculatorTextField
                        label="Default Serving (g)"
                        renderTrigger={renderTrigger}
                        initialValue={defaultServing}
                        setNumber={(newNumberValue: number) => setDefaultServing(newNumberValue)}
                    />
                </Grid>
                <Grid
                    item
                    sm={4}
                    xs={6}
                >
                    <CalculatorTextField
                        label="Calories (kcal)"
                        renderTrigger={renderTrigger}
                        initialValue={calories}
                        setNumber={(newNumberValue: number) => setCalories(newNumberValue)}
                    />
                </Grid>
                <Grid
                    item
                    sm={4}
                    xs={6}
                >
                    <CalculatorTextField
                        label="Protein (g)"
                        renderTrigger={renderTrigger}
                        initialValue={protein}
                        setNumber={(newNumberValue: number) => setProtein(newNumberValue)}
                    />
                </Grid>
                <Grid
                    item
                    sm={4}
                    xs={6}
                >
                    <CalculatorTextField
                        label="Carbs (g)"
                        renderTrigger={renderTrigger}
                        initialValue={carbs}
                        setNumber={(newNumberValue: number) => setCarbs(newNumberValue)}
                    />
                </Grid>
                <Grid
                    item
                    sm={4}
                    xs={6}
                >
                    <CalculatorTextField
                        label="Fats (g)"
                        renderTrigger={renderTrigger}
                        initialValue={fats}
                        setNumber={(newNumberValue: number) => setFats(newNumberValue)}
                    />
                </Grid>
            </Grid>

            {/* Buttons */}
            <EditFoodDishButtons 
                isLoading={isLoading}
                disabled={!selectedFood}
                handleUpdate={handleUpdate}
                setIsDeleteDialogOpen={setIsDeleteDialogOpen}
            />

            {/* Delete Dialog */}
            {
                !selectedFood ? null : 
                <EditFoodDishDeleteAlertDialog 
                    open={isDeleteDialogOpen}
                    setOpen={setIsDeleteDialogOpen}
                    foodDishToDelete={selectedFood.name}
                    handleDelete={handleDelete}
                />
            }
        </>
    )
}

export default EditFoodForm;