import { Category, PrismaClient } from "@prisma/client";
import { IProductRepository } from "../domain/repository/product.repository";

export class PrismaProductRepository implements IProductRepository {
    constructor(
        private db: PrismaClient
    ){}
    
    async createCategory(name: string): Promise<void> {
        await this.db.category.create({
            data: {
                name
            }
        })
    }

    async createProduct(name: string, description: string, price: number, image: string, userId: string, categoryIds: string[]): Promise<void> {
        await this.db.product.create({
            data: {
                name,
                description,
                price,
                image,
                userId,
                categories: {
                    connect: categoryIds.map((id: string) => ({ id }))
                }
            }
        })
    }

    async getCategoryById(id: string): Promise<Partial<Category> | null> {
        return await this.db.category.findFirst({
            where: {
                id
            },
            select :{
                id: true,
                name: true
            }
        })
    }
}