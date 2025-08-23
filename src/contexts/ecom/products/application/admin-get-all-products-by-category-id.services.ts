import { Product } from "@prisma/client";
import { IProductRepository } from "../domain/repository/product.repository";
import { PaginateResponse } from "src/contexts/shared/domain/interface/paginate";

export class AdminGetAllProductsByCategoryIdService {
     constructor(private readonly productRepository: IProductRepository) { }
        invoke(id: string, search: string, page: number, limit: number):  Promise<PaginateResponse<Partial<Product[]>>> {
            if(!id) {
                 Promise.resolve({
                    meta: {
                        total_records: 0,
                        total_pages: 0,
                        current_page: page,
                        is_first_page: page === 1,
                        is_last_page: page === 0
                    },
                    data: []
                });
            }
            return this.productRepository.getProductsByCategoryId(id, search, page, limit);
        }
}