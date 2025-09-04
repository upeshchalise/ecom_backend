import { Category, InteractionType, Product } from "@prisma/client"
import { PaginateRequest, PaginateResponse } from "../../../../../contexts/shared/domain/interface/paginate"
import { CategoryIds, ProductPaginateRequest, SalesAnalytics } from "../interface/product-paginate.interface"

export interface IProductRepository {
    createCategory(name: string): Promise<void>
    createProduct(name: string, description: string, price: number, image: string,quantity: number, userId: string, categoryIds: string[]): Promise<void>
    getCategoryById(id: string): Promise<Partial<Category> | null>
    getAllProducts({limit, page, search, categories}:ProductPaginateRequest):Promise<PaginateResponse< Partial<Product[]>>>
    getProductById(id: string): Promise<Partial<Product> | null>
    getAllCategories(): Promise<Partial<Category[]>>
    adminGetAllCategories(): Promise<Partial<Category[]>>
    getProductsByCategory(categoryId: string): Promise<Partial<Product[]>>
    getCategoryByName(name: string): Promise<Partial<Category> | null>
    getProductsByCategoryId(id: string, search: string, page: number, limit: number):  Promise<PaginateResponse<Partial<Product[]>>>
    salesAnalysis(endDate: string): Promise<SalesAnalytics>
    updateRecommendationTable(userId: string, categoryIds: string[], interactionType: InteractionType): Promise<void>
    getCategoriesIdByProductId(productId: string):Promise<CategoryIds | null>
    getRecommendedProducts(userId: string): Promise<Partial<Product[]>>
    updateProduct(productId: string, updateData: any): Promise<void>
    deleteProduct(productId: string): Promise<void>
    getProductsByUserId(userId: string, {search, page, limit}: PaginateRequest): Promise<PaginateResponse<Partial<Product[]>>>
}