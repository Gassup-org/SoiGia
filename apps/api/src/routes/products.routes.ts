import { Router } from "express";
import { listProductsByCategory, getProductDetail } from "../controllers/products.controller";

export const productsRouter = Router();

productsRouter.get("/", listProductsByCategory);
productsRouter.get("/:slug", getProductDetail);
