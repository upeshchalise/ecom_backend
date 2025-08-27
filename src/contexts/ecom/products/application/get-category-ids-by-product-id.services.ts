import { CategoryIds } from "../domain/interface/product-paginate.interface";
import { IProductRepository } from "../domain/repository/product.repository";

export class GetCategoriesIdByProductIdServices {
    constructor(private readonly productRepository: IProductRepository) {}

    async invoke(productId: string): Promise<CategoryIds | null> {
        return await this.productRepository.getCategoriesIdByProductId(productId);
    }
}
