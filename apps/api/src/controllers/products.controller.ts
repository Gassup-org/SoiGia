import { Request, Response } from "express";
import { productsService } from "../services/products.service";

export async function listProductsByCategory(request: Request, response: Response) {
  const category = String(request.query.category ?? "");
  const data = await productsService.listProductsByCategory(category);
  response.json(data);
}

export async function getProductDetail(request: Request, response: Response) {
  const data = await productsService.getProductBySlug(request.params.slug);
  response.json(data);
}
