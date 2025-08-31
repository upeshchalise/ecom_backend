import { IProductRepository } from "../domain/repository/product.repository";

export class AdminCreateProductServices {
        constructor(private readonly productRepository: IProductRepository) {}

        public async invoke(name: string, description: string, price: number, image: string,quantity: number, userId: string, categoryIds: string[]): Promise<void> {
            return this.productRepository.createProduct(name, description, price, image, quantity,userId, categoryIds);
        }
    
}