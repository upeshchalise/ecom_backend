import { PrismaClient } from "@prisma/client";
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
}