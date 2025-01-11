import express from "express"
import authRoutes from "./routes/auth.route.js"
import messageRoutes from './routes/message.route.js'
import dotenv from 'dotenv'
import { connect } from "mongoose";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from 'cors'

const app = express();

dotenv.config()

app.use(express.json()) // Will allow to extract the json data out of body
app.use(cookieParser())

app.use("/api/auth", authRoutes)
app.use("/api/message", messageRoutes)
app.use(cors({ 
    origin: "http://localhost:5173",
    credentials: true
}
))

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    //MongoDB Connection
    connectDB()
})

//Express is the 1st package(web frame work) we are using that will provide us with routes middlewares etc.