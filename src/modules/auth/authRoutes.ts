import { Router } from "express";
import { authController } from "./authController";

const router = Router();

router.post("/register", authController.createUser);
router.post("/login", authController.logInUser);

export const authRoutes = router;
