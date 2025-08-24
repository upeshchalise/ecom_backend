import { Category, Product } from "@prisma/client"
import { PaginateResponse } from "../../../../../contexts/shared/domain/interface/paginate"
import { ProductPaginateRequest, SalesAnalytics } from "../interface/product-paginate.interface"

export interface IProductRepository {
    createCategory(name: string): Promise<void>
    createProduct(name: string, description: string, price: number, image: string, userId: string, categoryIds: string[]): Promise<void>
    getCategoryById(id: string): Promise<Partial<Category> | null>
    getAllProducts({limit, page, search, categories}:ProductPaginateRequest):Promise<PaginateResponse< Partial<Product[]>>>
    getProductById(id: string): Promise<Partial<Product> | null>
    getAllCategories(): Promise<Partial<Category[]>>
    adminGetAllCategories(): Promise<Partial<Category[]>>
    getProductsByCategory(categoryId: string): Promise<Partial<Product[]>>
    getCategoryByName(name: string): Promise<Partial<Category> | null>
    getProductsByCategoryId(id: string, search: string, page: number, limit: number):  Promise<PaginateResponse<Partial<Product[]>>>
    salesAnalysis(endDate: string): Promise<SalesAnalytics>
}