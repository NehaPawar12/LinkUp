import express from "express"
import { login, logout, signup } from "../controllers/auth.controller.js"

const router = express.Router()

//Creating the routers and these functions are in auth contoller we have imported them here.
router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)

export default router;