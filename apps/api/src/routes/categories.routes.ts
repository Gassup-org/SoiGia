import { Router } from "express";
import { listCategories } from "../controllers/categories.controller";

export const categoriesRouter = Router();

categoriesRouter.get("/", listCategories);
