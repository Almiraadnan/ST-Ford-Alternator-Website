import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import userRoutes from "./routes/user.routes.mjs"
import authRoutes from "./routes/auth.routes.mjs"
import cookieParser from "cookie-parser"
import cors from "cors"
dotenv.config()

const port = process.env.PORT || 3000
const app = express()
app.use(express.json())
app.use(cookieParser())
// app.use(cors({ origin: "*", credentials: true, }))

app.use("/api/user", userRoutes)
app.use("/api/auth", authRoutes)
mongoose.connect(process.env.MONGO)
    .then(() => {
        console.log("Connected to mongodb!");
    }).catch((err) => {
        console.log(err);

    })

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
})


app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Interval Server Error"
    return res.status(statusCode).json({
        success: false,
        message,
        statusCode
    })
})