import express from "express"
import authRoutes from "./routes/auth.route.js"

const app = express();

app.use("/api/auth", authRoutes)

app.listen(5001, () => {
    console.log("Server is running on port 5001");
})

//Express is the 1st package(web frame work) we are using that will provide us with routes middlewares etc.