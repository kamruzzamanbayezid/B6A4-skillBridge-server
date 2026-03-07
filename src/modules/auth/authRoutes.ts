import { Router } from "express";
import { authController } from "./authController";
import auth from "../../middlewares/auth";

const router = Router();

router.post("/register", authController.createUser);
router.post("/login", authController.logInUser);
router.get("/me", auth(), authController.getCurrentUser);

export const authRoutes = router;
