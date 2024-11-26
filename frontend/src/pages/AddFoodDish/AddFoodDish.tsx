import { useContext, useState } from "react";

import Header from "../../components/Header";
import { AddFoodCard } from "./AddFoodCard";
import { MacrosCard } from "../../components/MacrosCard";

import { AddDishCard } from "./AddDishCard";
import { UserDataContext } from "../../context/UserDataContext";
import { Loading } from "../../components/Loading";
import { checkAuth } from "../../utils/checkAuth";
import { SelectedFoodDish } from "../../interfaces/selectedFoodDish";
import { Macros } from "../../interfaces/macros";
import { checkState } from "../../utils/checkState";
import { MacrosIncreaseIndicator } from "../../components/MacrosIncreaseIndicator";

function AddFoodDish() {
    // Check if user is authenticated
    if (!checkAuth()) return

    // Check if state is lost
    checkState()

    const {
        isFetchingData
    } = useContext(UserDataContext)
    
    const [caloriesIncrease, setCaloriesIncrease] = useState<number>(0)
    const [proteinIncrease, setProteinIncrease] = useState<number>(0)
    const [carbsIncrease, setCarbsIncrease] = useState<number>(0)
    const [fatsIncrease, setFatsIncrease] = useState<number>(0)

    const [selectedFoodDish, setSelectedFoodDish] = useState<SelectedFoodDish>({name: '', id: ''})

    const [isDish, setIsDish] = useState(false)

    function setMacrosIncrease(macros: Macros) {
        setCaloriesIncrease(macros.calories)
        setCarbsIncrease(macros.carbs)
        setProteinIncrease(macros.protein)
        setFatsIncrease(macros.fats)
    }

    return (
        isFetchingData ? <Loading /> :
        <>
            <Header />
            
            <MacrosCard 
                caloriesIncrease={caloriesIncrease}
                proteinIncrease={proteinIncrease}
                carbsIncrease={carbsIncrease}
                fatsIncrease={fatsIncrease}
            />

            {/* Increase Meter */}
            <MacrosIncreaseIndicator 
                caloriesIncrease={caloriesIncrease}
                proteinIncrease={proteinIncrease}
                carbsIncrease={carbsIncrease}
                fatsIncrease={fatsIncrease}
            />

            {
                isDish ? <AddDishCard 
                    setIsDish={setIsDish}
                    selectedFoodDish={selectedFoodDish}
                    setSelectedFoodDish={setSelectedFoodDish}
                    setMacrosIncrease={setMacrosIncrease}
                /> : <AddFoodCard 
                    setIsDish={setIsDish}
                    selectedFoodDish={selectedFoodDish}
                    setSelectedFoodDish={setSelectedFoodDish}
                    setMacrosIncrease={setMacrosIncrease}
                />
            }
        </>
    );
}

export default AddFoodDish;