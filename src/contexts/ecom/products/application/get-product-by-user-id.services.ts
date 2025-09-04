import { PaginateRequest, PaginateResponse } from "src/contexts/shared/domain/interface/paginate";
import { IProductRepository } from "../domain/repository/product.repository";
import { Product } from "@prisma/client";

export class GetProductByUserIdServices {
    constructor(private readonly productRepository: IProductRepository) {}

    async invoke(userId: string, {search, page,limit}:PaginateRequest): Promise<PaginateResponse<Partial<Product[]>>> {
        return await this.productRepository.getProductsByUserId(userId, {search, page, limit});
    }
}