import express from "express";
import { loginController, refreshTokenController, signUpController } from "../controllers/auth.controller.js";
import { userProfile } from "../controllers/user.controller.js";
import { isAuthenticate } from "../middlewares/authenticate.mddleware.js";

const router = express.Router();

router.post("/signup", signUpController);
router.post("/login", loginController);

router.get("/refresh", refreshTokenController);

router.get("/users", isAuthenticate, userProfile)

export default router;