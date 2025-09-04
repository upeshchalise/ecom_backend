import { IProductRepository } from "../domain/repository/product.repository";

export class DeleteProductService {
        constructor(private readonly productRepository: IProductRepository) {}

        public async invoke(productId: string): Promise<void> {
            await this.productRepository.deleteProduct(productId);
        }
}