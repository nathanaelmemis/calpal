import moment from "moment"
import { client } from "../database"
import { routeLog, validateData } from "../utils"

import {Request, Response} from 'express'

interface FoodEatenInterface {
    _id: string,
    userID: string,
    mealType: string,
    date: string,
    food: string,
    grams: number,
    quantity: number,
}

interface DetailedFoodEatenInterface extends FoodEatenInterface {
    calories: number
    carbs: number
    protein: number
    fats: number
}


interface MongoDBCollectionFindQuery {
    userID: string,
    date?: {
        $gte: Date
    }
}

type userDataCollections = 'userData' | 'foods' | 'dishes' | 'foodEaten' | 'dishEaten'

interface CustomRequest extends Request {
    query: {
        collectionsToRetrieve: userDataCollections[]
    }
}

type RetrievedCollections = {
    [key in userDataCollections]?: any
}

// Valid collections to retrieve
// Users collection should not be included because it contains login credentials
const USER_DATA_COLLECTIONS = ['userData', 'foods', 'dishes', 'foodEaten', 'dishEaten']

export async function getUserData(req: CustomRequest, res: Response) {
    try {
        await client.connect()

        const userID = req.body.userID
        const collectionsToRetrieve: userDataCollections[] = req.query.collectionsToRetrieve
        
        const data = {
            collectionsToRetrieve: collectionsToRetrieve,
            userID: userID
        }
        const collectinsToRetrieveScheme: userDataCollections[] = ['userData']
        const schema = {
            collectionsToRetrieve: collectinsToRetrieveScheme,
            userID: ''
        }
        if (!validateData(req, res, data, schema)) {
            return
        }

        routeLog(req, `Getting Collections: ${userID}`)

        const retrievedCollections: RetrievedCollections = {}
        for (const collection of data.collectionsToRetrieve) {
            if (!USER_DATA_COLLECTIONS.includes(collection)) {
                routeLog(req, `Invalid Collection: ${collection}`)
                res.status(400).send(`Invalid Collection: ${collection}`)
                return
            }

            // Retrieve user data
            const query: MongoDBCollectionFindQuery = {
                userID: userID,
                date: { $gte: moment().startOf('day').toDate() }
            }
            if (collection !== 'foodEaten' && collection !== 'dishEaten') {
                delete query.date
            }
            let result = null
            if (collection === 'userData') {
                result = await client.db("CalPal").collection(collection).findOne(query)
            } else {
                result = await client.db("CalPal").collection(collection).find(query).toArray()
            }

            if (result) {
                retrievedCollections[collection] = result
            }
        }

        routeLog(req, `Collections Found: ${userID}`)

        res.status(200).send(retrievedCollections)
    } catch (error: any) {
        routeLog(req, error)
        res.status(500).send(error)
    } finally {
        await client.close()
    }
}