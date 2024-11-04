import { ReactElement, useState } from 'react';
import { UserDataContext } from './UserDataContext';
import { Dish } from '../interfaces/dish';
import { Food } from '../interfaces/food';
import { UserData } from '../interfaces/userData';
import { Meal } from '../interfaces/meal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FoodDishEatenEditing } from '../interfaces/foodDishEatenEditing';
import { FoodEaten } from '../interfaces/foodEaten';
import { DishEaten } from '../interfaces/dishEaten';

interface IUserDataContextProviderProps {
    children: ReactElement[] | ReactElement;
}

export const UserDataContextProvider = ({ children }: IUserDataContextProviderProps) => {
    const navigate = useNavigate()

    const [isFetchingData, setIsFetchingData] = useState<boolean>(false)

    // Data retrieved from API
    const [userData, setUserData] = useState<UserData>({
        name: '',
        caloriesLimit: 0,
        carbsLimit: 0,
        proteinLimit: 0,
        fatsLimit: 0,
        breakfastCaloriesLimit: 0,
        lunchCaloriesLimit: 0,
        snacksCaloriesLimit: 0,
        dinnerCaloriesLimit: 0
    })
    const [foods, setFoods] = useState<Food[]>([])
    const [dishes, setDishes] = useState<Dish[]>([])
    const [foodEaten, setFoodEaten] = useState<FoodEaten[]>([])
    const [dishEaten, setDishEaten] = useState<DishEaten[]>([])

    // Global states
    const [mealType, setMealType] = useState<Meal>('breakfast')
    const [foodDishEatenEditing, setFoodDishEatenEditing] = useState<FoodDishEatenEditing>({
        foodDishEatenEditingID: '',
        isDish: false
    })

    // Get specified data from API
    async function getData(collectionsToRetrieve: ('userData' | 'foods' | 'dishes' | 'foodEaten' | 'dishEaten')[]) {
        setIsFetchingData(true)

        try {
            const res = await axios.get('/api/getUserData', {
                params: {
                    collectionsToRetrieve: collectionsToRetrieve,
                    date: new Date().toDateString()
                }
            })

            if (res.data.userData) {
                setUserData(res.data.userData)
            }
            if (res.data.foods) {
                setFoods(res.data.foods)
            }
            if (res.data.dishes) {
                setDishes(res.data.dishes)
            }
            if (res.data.foodEaten) {
                setFoodEaten(res.data.foodEaten)
            }
            if (res.data.dishEaten) {
                setDishEaten(res.data.dishEaten)
            }
        } catch (error: any) {
            console.error(error)
            if (error.response.status === 401) {
                navigate('/login')
            }
            if (error.response.status === 500) {
                navigate('/error')
            }
        }

        setIsFetchingData(false)
    }

  return (
    <UserDataContext.Provider 
        value={{ 
            isFetchingData,
            userData, 
            foods,
            dishes,
            foodEaten,
            dishEaten,
            getData,
            mealType,
            setMealType,
            foodDishEatenEditing,
            setFoodDishEatenEditing
        }}
    >
      {children}
    </UserDataContext.Provider>
  );
};
