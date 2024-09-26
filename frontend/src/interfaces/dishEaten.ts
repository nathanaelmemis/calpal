export interface DishEaten {
    _id: string
    userID: string
    date: string
    mealType: string
    grams: number
    quantity: number
    dishID: string
    foodServing: number[]
}