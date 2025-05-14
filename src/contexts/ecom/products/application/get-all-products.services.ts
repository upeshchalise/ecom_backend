import { Product } from "@prisma/client";
import { IProductRepository } from "../domain/repository/product.repository";
import { PaginateResponse } from "src/contexts/shared/domain/interface/paginate";
import { ProductPaginateRequest } from "../domain/interface/product-paginate.interface";

export class GetAllProductsService {
    constructor(private productRepository: IProductRepository) { }

    async invoke({limit, page, search}:ProductPaginateRequest): Promise<PaginateResponse< Partial<Product[]>>>{
        return this.productRepository.getAllProducts({limit, page, search});
    }
}