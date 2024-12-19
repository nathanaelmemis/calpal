import { Button, Grid, IconButton, TextField, useMediaQuery, useTheme } from "@mui/material";
import { AddCircle as AddCircleIcon, RemoveCircle as RemoveCircleIcon} from '@mui/icons-material';
import { useContext, useState } from "react";
import { CreateDishFormFoodRowTextField } from "./CreateDishFormFoodRowTextField";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CreateFoodDishButtons } from "./CreateFoodDishButtons";
import { CalculatorTextField } from "../../components/CalculatorTextField";
import { UserDataContext } from "../../context/UserDataContext";
import { DishFood } from "../../interfaces/dishFood";

export function CreateDishForm() {
    const {
        getData,
        foods
    } = useContext(UserDataContext)

    const [refreshTrigger, setRefreshTrigger] = useState<string>(Date.now().toFixed())
    const [isLoading, setIsLoading] = useState(false)
    const [isFoodAlreadyExist, setIsFoodAlreadyExist] = useState(false)

    const [foodName, setFoodName] = useState('')    
    const [defaultServing, setDefaultServing] = useState(1)
    const [dishData, setDishData] = useState<DishFood[]>([
        { foodID: '', defaultServing: 1 }
    ])
    
    const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'))
    const navigate = useNavigate()
    
    function handleRemoveButtonOnClick(index: number) {
        const disDataTemp = [...dishData.filter((_, i) => i !== index)]

        if (disDataTemp.length === 0) {
            setDishData([{foodID: '', defaultServing: 1}])
        } else {
            setDishData(disDataTemp)
        }

        setRefreshTrigger(refreshTrigger + 1)
    }

    async function handleCreateButtonClick() {
        setIsLoading(true)

        try {
            let tempName = foodName
            let foodNames: string[] = []
            if (tempName == '') {
                dishData.forEach((food) => {
                    foodNames = [...foodNames, foods.find((f) => f._id === food.foodID)?.name || '']
                })

                tempName = foodNames.join(' & ')
            }

            const res = await axios.post('/api/createDish', {
                name: tempName,
                defaultServing: defaultServing,
                foods: dishData
            })

            if (res.status === 200) {
                await getData(['dishes'])
                navigate(-1)
            }
        } catch (error: any) {
            if (error.response.data === 'Dish already exists.') {
                setIsFoodAlreadyExist(true)
            }

            console.error(error)
        }

        setIsLoading(false)
    }

    return (
        <>
            {/* Food/Dish Name */}
            <Grid
                item
                xs={12}
                display={'flex'}
                columnGap={2}
            >
                <Grid
                    item
                    xs={8}
                >
                    <TextField 
                        label={'Dish Name'}
                        color="secondary"
                        fullWidth
                        size={isMobile ? 'small' : 'medium'}
                        value={foodName}
                        error={isFoodAlreadyExist}
                        helperText={isFoodAlreadyExist ? 'Food already exists.' : ''}
                        onChange={(e) => {setFoodName(e.target.value); setIsFoodAlreadyExist(false)}}
                        sx={(theme) => ({
                            '& .MuiInputBase-input': {
                                fontSize: isMobile ? theme.typography.body2.fontSize : theme.typography.body1.fontSize
                            }
                        })}
                    />
                </Grid>
                <Grid
                    item
                    xs={4}
                >
                    <CalculatorTextField
                        label="Default Serving (g)"
                        initialValue={1}
                        setNumber={setDefaultServing}
                    />
                </Grid>
            </Grid>
            
            {/* Dish Food List */}
            {
                dishData.map((dishFood: DishFood, index) => (
                    <Grid
                        key={index + refreshTrigger}
                        item
                        xs={12}
                        display={'flex'}
                        alignItems={'center'}
                    >
                        <Grid
                            item
                            xs={1.5}
                            sm={1}
                            display={'flex'}
                            justifyContent={'center'}>  
                            <IconButton
                                color="error"
                                size="small"
                                onClick={() => handleRemoveButtonOnClick(index)}
                            >
                                <RemoveCircleIcon />
                            </IconButton>
                        </Grid>
                        <Grid
                            item
                            xs={10.5}
                            sm={11}
                            columnGap={2}
                            display={'flex'}
                        >   
                            <CreateDishFormFoodRowTextField 
                                initialValueFoodID={dishFood.foodID}
                                defaultServingInitialValue={dishFood.defaultServing}
                                index={index}
                                dishData={dishData}
                                setDishData={setDishData}
                            />
                        </Grid>
                    </Grid>
                ))
            }

            {/* Add Food TextField Button */}
            <Button 
                fullWidth
                color="secondary"
                variant="contained"
                onClick={() => {
                    setDishData([...dishData, {foodID: '', defaultServing: 1}])
                    setRefreshTrigger(refreshTrigger + 1)
                }}
                sx={{
                    mt: isMobile ? '0' : '1em'
                }}
            >
                <AddCircleIcon 
                    fontSize={isMobile ? 'small' : "medium"}
                />
            </Button>

            <CreateFoodDishButtons 
                isLoading={isLoading}
                handleCreateButtonClick={handleCreateButtonClick}
            />
        </>
    )
}