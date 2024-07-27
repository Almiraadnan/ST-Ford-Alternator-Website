import express from "express"
import { deleteUser, test, updateUser } from "../controllers/user.controller.mjs"
import { verifyToken } from "../utils/verifyUser.mjs"

const router = express.Router()

router.get("/", test)
router.post("/update/:id", verifyToken, updateUser)
router.post("/delete/:id", verifyToken, deleteUser)

export default router