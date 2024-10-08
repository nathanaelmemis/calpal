import { Grid, TextField } from "@mui/material"
import { useState, useEffect, useContext, ReactElement } from "react"
import { Dish } from "../../interfaces/dish"
import { DishFood } from "../../interfaces/dishFood"
import { UserDataContext } from "../../context/UserDataContext"
import { Food } from "../../interfaces/food"
import { SelectedFoodDish } from "../../interfaces/selectedFoodDish"

interface DishfoodListProps {
    dishes: Dish[],
    selectedFood: SelectedFoodDish,
    foodServing: number[],
    handleOnChangeServing: (e: any, index: number, setServing: (newValue: number) => void) => void
}

export function DishFoodList(props: DishfoodListProps) {
    const [renderedList, setRenderedList] = useState<ReactElement[]>([])

    const {
        foods,
    } = useContext(UserDataContext)

    // Get dish data
    useEffect(() => {
        const dish = props.dishes.find((dish: Dish) => dish._id === props.selectedFood.id)

        if (!dish) return
        
        const renderedList = dish.foods.map((dishFoodItem: DishFood, index: number) => {
            const food = foods.find((foodItem: Food) => foodItem._id === dishFoodItem.foodID)

            if (!food) {
                console.error('Food not found')
            }

            return (
                <Grid
                    container
                    columnSpacing={2}
                    display={'flex'}
                    mb={'1em'}
                    justifyContent={'flex-end'}
                    key={Date.now().toFixed() + index.toString()}
                >
                    <Grid
                        item
                        xs={7}
                    >
                        <TextField 
                            value={food?.name || ''}
                            color="secondary" 
                            fullWidth
                            sx={{
                                pointerEvents: 'none',
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'rgba(0, 0, 0, 0.12)',
                                    }
                                }
                            }}
                        />
                    </Grid>
                    <Grid
                        item
                        xs={4}
                    >
                        <DishFoodItem 
                            index={index}
                            serving={props.foodServing[index]}
                            handleOnChangeServing={props.handleOnChangeServing}
                        />
                    </Grid>
                </Grid>
            )
        })

        setRenderedList(renderedList)
    }, [props.selectedFood])

    return (
        <>{renderedList}</>
    )
}

interface DishFoodItemProps {
    handleOnChangeServing: (e: any, index: number, setServing: (newValue: number) => void) => void,
    index: number,
    serving: number,
}

function DishFoodItem(props: DishFoodItemProps) {
    const [serving, setServing] = useState(props.serving)

    return (
        <TextField
            fullWidth
            color="secondary"
            label="Serving (g)"
            value={serving}
            onChange={(e) => props.handleOnChangeServing(e, props.index, setServing)}
        />
    )
}