import { Category } from "@prisma/client";
import { IProductRepository } from "../domain/repository/product.repository";

export class GetCategoryByName {
        constructor(private readonly productRepository: IProductRepository) {}

        async invoke(name: string): Promise<Partial<Category> | null> {
            return await this.productRepository.getCategoryByName(name)
        }
}
