import { Product } from "@prisma/client";
import { IProductRepository } from "../domain/repository/product.repository";

export class GetProductsByCategoryServices {
        constructor(private readonly productRepository: IProductRepository) {}

        invoke(categoryId: string): Promise<Partial<Product[]>> {
                return this.productRepository.getProductsByCategory(categoryId);
        }
}