import express from "express"
import { updateProfile, login, logout, signup, checkAuth } from "../controllers/auth.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js"

const router = express.Router()

//Creating the routers and these functions are in auth contoller we have imported them here.
router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)

//if we see that they are authenticated then we go for update
router.put("/update-profile", protectRoute , updateProfile)

router.get("/check", protectRoute, checkAuth)

export default router;