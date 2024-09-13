import { useState } from "react"
import { DishInterface } from "../../Interface"
import { CalculatorTextField } from "../../components/CalculatorTextField"

interface AddDishCardServingProps {
    selectedFood: string,
    dishes: DishInterface[],
    foodServing: number[],
    setFoodServing: Function,
    index: number
}

function AddDishCardServingTextField(props: AddDishCardServingProps) {
    const [serving, setServing] = useState(props.dishes.find(dish => dish.name === props.selectedFood)?.foods[props.index].defaultServing || 0)
    
    return (
        <CalculatorTextField
            label="Serving (g)"
            initialValue={serving}
            setNumber={(newNumberValue: number) => {
                const newFoodServing = [...props.foodServing]
                newFoodServing[props.index] = newNumberValue
                props.setFoodServing(newFoodServing)
                setServing(newNumberValue)
            }}
        />
    )
}

export default AddDishCardServingTextField