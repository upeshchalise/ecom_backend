import { IProductRepository } from "../domain/repository/product.repository";

export class AdminCreateProductServices {
        constructor(private readonly productRepository: IProductRepository) {}

        public async invoke(name: string, description: string, price: number, image: string, userId: string, categoryIds: string[]): Promise<void> {
            return this.productRepository.createProduct(name, description, price, image, userId, categoryIds);
        }
    
}