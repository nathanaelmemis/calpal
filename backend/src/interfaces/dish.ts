import { DishFood } from "./dishFood"

export interface Dish {
    _id: string
    userID: string
    name: string
    defaultServing: number
    foods: DishFood[]
}