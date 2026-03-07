import express from "express";
import cors from "cors";
import { authRoutes } from "./modules/auth/authRoutes";
import notFound from "./middlewares/notFound";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import cookieParser from "cookie-parser";
import config from "./config";
import { categoryRouter } from "./modules/category/categoryRoutes";
import { tutorProfileRoutes } from "./modules/tutorProfile/tutorProfileRoutes";
import { UserRoutes } from "./modules/user/userRoutes";
import { slotRouters } from "./modules/slot/slotRoutes";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: config.frontend_url,
    credentials: true,
  }),
);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/tutors", tutorProfileRoutes);
app.use("/api/v1/users", UserRoutes);
app.use("/api/v1/slots", slotRouters);

app.get("/", (req, res) => {
  res.send("SkillBridge app for learners!!");
});

app.use(notFound);

app.use(globalErrorHandler);

export default app;
