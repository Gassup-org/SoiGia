import { Router } from "express";
import { getPriceComparisons } from "../controllers/price-comparison.controller";

export const priceComparisonRouter = Router();

priceComparisonRouter.get("/:productId", getPriceComparisons);
