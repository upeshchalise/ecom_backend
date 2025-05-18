import { Category } from "@prisma/client";
import { IProductRepository } from "../domain/repository/product.repository";

export class GetAllCategoriesServices{
    constructor(private readonly productRepository: IProductRepository) { }
    invoke(): Promise<Partial<Category[]>> {
        return this.productRepository.getAllCategories();
    }
}