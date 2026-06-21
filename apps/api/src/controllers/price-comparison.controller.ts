import { Request, Response } from "express";
import { priceComparisonService } from "../services/price-comparison.service";

export async function getPriceComparisons(request: Request, response: Response) {
  const data = await priceComparisonService.getByProductId(request.params.productId);
  response.json(data);
}
