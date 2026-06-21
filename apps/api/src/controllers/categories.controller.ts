import { Request, Response } from "express";
import { categoriesService } from "../services/categories.service";

export async function listCategories(_request: Request, response: Response) {
  const data = await categoriesService.listCategories();
  response.json(data);
}
