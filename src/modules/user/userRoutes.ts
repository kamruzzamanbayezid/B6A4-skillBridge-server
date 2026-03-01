import express from "express";
import { UserControllers } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = express.Router();

router.get("/all-tutors", UserControllers.getAllTutors);
router.get("/", auth(UserRole.ADMIN), UserControllers.getAllUsers);
router.get("/by-role", UserControllers.getAllUsersOrRole);
router.get("/student-count", UserControllers.getStudentCount);
router.patch(
  "/manage-status/:id",
  auth(UserRole.ADMIN),
  UserControllers.updateUserStatus,
);

export const UserRoutes = router;
