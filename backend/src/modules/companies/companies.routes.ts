
import { Router } from "express";
import { authenticateToken } from "../../middlewares/auth.middleware";
import { listMyCompanies } from "./companies.controller";

const companiesRouter = Router();

companiesRouter.get("/", authenticateToken, listMyCompanies);

export default companiesRouter;
