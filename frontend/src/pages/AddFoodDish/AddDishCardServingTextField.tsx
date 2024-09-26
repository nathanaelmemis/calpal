import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { CalculatorTextField } from "../../components/CalculatorTextField"

interface AddDishCardServingProps {
    foodServing: number[]
    setFoodServing: Dispatch<SetStateAction<number[]>>
    index: number
    renderTrigger: number
}

function AddDishCardServingTextField({ foodServing, setFoodServing, index, renderTrigger }: AddDishCardServingProps) {
    const [serving, setServing] = useState<number>(0)

    useEffect(() => {
        const newFoodServing = [...foodServing]
        newFoodServing[index] = serving
        setFoodServing(newFoodServing)
    }, [serving])
    
    return (
        <CalculatorTextField
            label="Serving (g/ratio)"
            initialValue={foodServing[index]}
            renderTrigger={renderTrigger}
            setNumber={setServing}
        />
    )
}

export default AddDishCardServingTextField