import User from "../model/user.model.mjs"
import { errorHandler } from "../utils/error.mjs"
import bcyrptjs from "bcryptjs"

export const test = (req, res) => {
    res.json({
        message: "API is working!"
    })
}

// update user
export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, "You can only update your account!"))
    }
    try {
        if (req.body.password) {
            req.body.password = bcyrptjs.hashSync(req.body.password, 10)
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                profilePicture: req.body.profilePicture
            },
        },
            { new: true })
        const { password, ...rest } = updatedUser._doc
        res.status(200).json(updatedUser)
    } catch (error) {
        console.log(error);
        next(error)
    }
}
// delete user

export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, "You can only delete your account!"))
    }
    try {
        console.log(req.params.id);
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json('User has been deleted...')
    } catch (error) {
        next(error)
    }
} 