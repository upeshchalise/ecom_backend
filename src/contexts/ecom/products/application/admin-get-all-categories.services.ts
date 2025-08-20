import { Category } from "@prisma/client";
import { IProductRepository } from "../domain/repository/product.repository";

export class AdminGetAllCategoriesService {
    constructor(private readonly productRepository: IProductRepository) { }
    invoke(): Promise<Partial<Category[]>> {
        return this.productRepository.adminGetAllCategories();
    }}