import { Category } from "@prisma/client"

export interface IProductRepository {
    createCategory(name: string): Promise<void>
    createProduct(name: string, description: string, price: number, image: string, userId: string, categoryIds: string[]): Promise<void>
    getCategoryById(id: string): Promise<Partial<Category> | null>
}