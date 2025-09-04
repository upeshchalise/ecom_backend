import { IProductRepository } from "../domain/repository/product.repository";

export class UpdateProductService {
        constructor(private readonly productRepository: IProductRepository) {}

        public async invoke(productId: string, updateData: any): Promise<void> {
            await this.productRepository.updateProduct(productId, updateData);
        }
}