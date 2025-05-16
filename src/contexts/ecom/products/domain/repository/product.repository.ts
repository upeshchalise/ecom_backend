import { Category, Product } from "@prisma/client"
import { PaginateResponse } from "../../../../../contexts/shared/domain/interface/paginate"
import { ProductPaginateRequest } from "../interface/product-paginate.interface"

export interface IProductRepository {
    createCategory(name: string): Promise<void>
    createProduct(name: string, description: string, price: number, image: string, userId: string, categoryIds: string[]): Promise<void>
    getCategoryById(id: string): Promise<Partial<Category> | null>
    getAllProducts({limit, page, search}:ProductPaginateRequest):Promise<PaginateResponse< Partial<Product[]>>>
    getProductById(id: string): Promise<Partial<Product> | null>
}