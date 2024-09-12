const { MongoClient, ServerApiVersion } = require('mongodb');
import dotenv from "dotenv";

dotenv.config();

const uri = `mongodb+srv://adminuser:${process.env.MONGO_PASSWORD}@calpal.ehmci.mongodb.net/?retryWrites=true&w=majority&appName=CalPal`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
export const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
