import { Product } from "@prisma/client";
import { IProductRepository } from "../domain/repository/product.repository";

export class GetProductByIdServices {
        constructor(private readonly productRepository: IProductRepository) {}
        invoke(id: string): Promise<Partial<Product> | null> {
                return this.productRepository.getProductById(id);
        }
}