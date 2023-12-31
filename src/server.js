// require('dotenv').config({ path: './env' })
import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app } from "./app.js";


dotenv.config({
    path: './.env'
})

connectDB().then(() => {
    app.on("error", (error) => {
        console.error("Error", error);
        throw error;
    })
    app.listen(process.env.PORT || 3000, () => {
        console.log(`server is running  at Port : ${process.env.PORT}`)
    })
}).catch((error) => {
    console.log("Mongo DB connection failed!!!", error)
})
/*
import { express } from "express";
const app = express()
    (async () => {
        try {
            await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`)
            app.on("error", (error) => {
                console.error("Error", error);
                throw error;
            })
            app.listen(process.env.PORT, () => {
                console.log(`App is listening in port ${process.env.PORT}`)
            })

        } catch (error) {
            console.error("Error".error)
        }
    })()

* */