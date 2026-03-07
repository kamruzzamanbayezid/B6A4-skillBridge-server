import { Router } from "express";
import { slotControllers } from "./slotControllers";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.post("/create-slot", auth(UserRole.TUTOR), slotControllers.createSlot);
router.get("/", auth(UserRole.TUTOR), slotControllers.tutorsSlot);
router.delete("/:slotId", auth(UserRole.TUTOR), slotControllers.deleteSlot);

export const slotRouters = router;
