import { Express, Router } from "express";
import { categoriesRouter } from "./categories.routes";
import { priceComparisonRouter } from "./price-comparison.routes";
import { productsRouter } from "./products.routes";

export function registerRoutes(app: Express) {
  const router = Router();

  router.get("/health", (_request, response) => {
    response.json({ status: "ok" });
  });

  router.use("/categories", categoriesRouter);
  router.use("/products", productsRouter);
  router.use("/price-comparisons", priceComparisonRouter);

  app.use("/api", router);
}
