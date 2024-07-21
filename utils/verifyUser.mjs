import jwt from "jsonwebtoken"
import { errorHandler } from "./error.mjs"

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token

    if (!token) return next(errorHandler(401, "Authentication failed!"))
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return next(errorHandler(403 , "Token is invalid"))
        req.user = user
        next()
    })

}