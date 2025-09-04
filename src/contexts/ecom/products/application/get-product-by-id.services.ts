import { Product } from "@prisma/client";
import { IProductRepository } from "../domain/repository/product.repository";

export class GetProductByIdServices {
        constructor(private readonly productRepository: IProductRepository) {}
        invoke(id: string): Promise<Partial<Product> | null> {
                console.log("Getting product by ID:", id);
                if (!id) {
                    return Promise.resolve(null);
                }
                return this.productRepository.getProductById(id);
        }
}