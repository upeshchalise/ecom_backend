import { IProductRepository } from "../domain/repository/product.repository";
import { PrismaProductRepository } from "../infrastructure/prisma-product.repository";

export class AdminCreateCategoryService {
    constructor(private productRepository: IProductRepository) {}


    public async invoke(name: string): Promise<void> {
        await this.productRepository.createCategory(name);
    }
}