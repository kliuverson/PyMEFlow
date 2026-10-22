
import { Router } from "express";
import {
  getCurrentUser,
  login,
  register,
} from "./auth.controller";
import { authenticateToken } from "../../middlewares/auth.middleware";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);

authRouter.get("/me", authenticateToken, getCurrentUser);

export default authRouter;
