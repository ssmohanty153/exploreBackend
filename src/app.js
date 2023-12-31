import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({
    limit: "100kb"
}))
app.use(express.urlencoded({ extended: true, limit: "100kb" }))

app.use(express.static("public"));


app.use(cookieParser())

app.on("error", (error) => {
    console.error("Error", error);
    throw error;
})

//routes


import userRouter from './routers/user.routes.js'

//routees declarton

app.use("/api/v1/users",userRouter)

export { app }