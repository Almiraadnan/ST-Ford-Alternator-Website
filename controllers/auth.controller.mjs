import User from "../model/user.model.mjs"
import bcryptjs from "bcryptjs"
import { errorHandler } from "../utils/error.mjs"
import jwt from "jsonwebtoken"

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body
    const hashedPassword = bcryptjs.hashSync(password, 10)
    const newUser = new User({ username, email, password: hashedPassword }
    )
    try {
        const user = await newUser.save()
        res.status(201).json({ message: "User created successfully!" })
    } catch (error) {
        next(errorHandler(500, error.message))
    }
}

export const signin = async (req, res, next) => {
    const { email, password } = req.body
    try {
        const validUser = await User.findOne({ email })
        if (!validUser) return next(errorHandler(404, "User not found"))
        const validPassword = bcryptjs.compareSync(password, validUser.password)
        if (!validPassword) return next(errorHandler(401, "Wrong credientials!"))
        const { password: hashedPassword, ...rest } = validUser._doc
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET)
        const expiryDate = new Date(Date.now() + 3600000) // 1 hour
        res.cookie('access_token', token, { httpOnly: true, expires: expiryDate }).status(200).json({rest, token})
    } catch (error) {
        next(error)
    }
}

export const google = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            const { password: hashedPassword, ...rest } = user._doc
            const expiryDate = new Date(Date.now() + 3600000) // 1 hour
            res.cookie('access_token', token,
                {
                    httpOnly: true,
                    expires: expiryDate
                }).status(200).json(rest)
        } else {
            const generatePassword =
                Math.random().toString(36).slice(-8) +
                Math.random().toString(36).slice(-8)
            const hashedPassword = bcryptjs.hashSync(generatePassword, 10)
            const newUser = new User({
                username: req.body.username.split(" ").join("").toLowerCase() + Math.floor(Math.random() * 10000).toString(),
                email: req.body.email,
                password: hashedPassword,
                profilePicture: req.body.photo,
            })

            await newUser.save()
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET)
            const { password: hashedPassword2, ...rest } = newUser._doc
            const expiryDate = new Date(Date.now() + 3600000) // 1 hour
            res.cookie('access_token', token, { httpOnly: true, expires: expiryDate }).status(200).json(rest)
        }
    } catch (error) {
        next(error)
    }
}
export const signout = async (req, res) => {
    res.clearCookie("access_token").status(200).json("Signout success!")
}