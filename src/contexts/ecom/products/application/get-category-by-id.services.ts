import { Category } from "@prisma/client";
import { IProductRepository } from "../domain/repository/product.repository";

export class GetCategoryById {
        constructor(private productRepository: IProductRepository) {}

        async invoke(id: string): Promise<Partial<Category> | null> {
            return await this.productRepository.getCategoryById(id)
        }
}
