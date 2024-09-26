import {Request, Response} from 'express'
import { client } from '../database'
import { ObjectId } from 'mongodb'
import { Dish } from '../interfaces/dish'
import { validateData, routeLog } from '../utils'

export async function deleteFoodDish(req: Request, res: Response) {
    try {
        await client.connect()

        const data = req.body
        const userID = data.userID
        const foodDishEatenID: string = data.foodDishEatenID

        // Data Validation
        const schema = {
            userID: "",
            foodDishEatenID: "",
            isDish: true,
        }
        if (!validateData(req, res, data, schema)) {
            return
        }

        routeLog(req, `Deleting Food/Dish: ${userID} ${foodDishEatenID}`)

        let result = null
        if (data.isDish) {
            result = await client.db("CalPal").collection("dishes").deleteOne({
                _id: new ObjectId(foodDishEatenID),
                userID: userID
            })
        } else {
            /**
             * This solution doesn't support atomic transactions, so if one of the updates fails, the database will be in an inconsistent state.
             * If another user tries to read or delete during this transaction, they may get an inconsistent result.
             */

            // get all dishes that contain the foodID
            const dishesToUpdate = 
            await client
                .db("CalPal").collection("dishes")
                .find<Dish>({ 
                    userID: userID, 
                    'foods.foodID': foodDishEatenID
                }).toArray()

            // get the indices of the dishes.foods that contain the food
            const dishesToUpdateData = dishesToUpdate.map((dish) => {
                const foodIndex = dish.foods.findIndex((dishFood) => dishFood.foodID === foodDishEatenID)
                return {
                    updateMany: {
                        'filter': { userID: userID, dishID: dish._id.toString() },
                        /**
                         * this slices the array into 2 parts, the first part is the array from 0 to foodIndex
                         * the second part is the array from foodIndex + 1 to the end of the array
                         * then it concatenates the 2 arrays together essentially removing the foodServing from the array
                         */
                        'update': {  
                            $set: { foodServing: {
                                $concatArrays:[ 
                                    { $slice:[ "$foodServing", foodIndex ] }, 
                                    { $slice:[ "$foodServing", { $add: [1,foodIndex] }, { $size: "$foodServing" } ] }
                                 ]
                            }}
                        },
                    }
                }
            })

            // update all dishes that contain the food
            const dishesUpdateResult = await client.db("CalPal").collection<Dish>("dishes").updateMany(
                { userID: userID },
                { $pull: { foods: { foodID: foodDishEatenID } } }
            )

            routeLog(req, `Dishes Updated: ${dishesUpdateResult.modifiedCount}`)

            // update all dishEaten that contain the food using the indices
            const dishEatenUpdateResult = await client.db("CalPal").collection("dishEaten").bulkWrite(dishesToUpdateData)

            routeLog(req, `DishEaten Updated: ${dishEatenUpdateResult.modifiedCount}`)

            // delete the food from the foods collection
            result = await client.db("CalPal").collection("foods").deleteOne({
                _id: new ObjectId(foodDishEatenID),
                userID: userID
            })

            routeLog(req, `Food Deleted: ${result.deletedCount}`)
        }

        if (!result.deletedCount) {
            throw new Error(`Failed To Delete Food/Dish Eaten: ${userID} ${foodDishEatenID}`)
        }
        
        routeLog(req, `Food/Dish Eaten deleted: ${userID} ${foodDishEatenID}`)

        res.sendStatus(200)
        // res.status(200).send(result.deletedCount)
    } catch (error: any) {
        routeLog(req, error.message)
        res.status(500).send(error)
    } finally {
        await client.close()
    }
}