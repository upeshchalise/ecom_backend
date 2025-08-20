import { Product } from "@prisma/client";
import { IProductRepository } from "../domain/repository/product.repository";

export class AdminGetAllProductsByCategoryIdService {
     constructor(private readonly productRepository: IProductRepository) { }
        invoke(id: string): Promise<Partial<Product[]>> {
            if(!id) {
                return Promise.resolve([]);
            }
            return this.productRepository.getProductsByCategoryId(id);
        }
}