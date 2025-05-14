import { Category, Prisma, PrismaClient, Product } from "@prisma/client";
import { IProductRepository } from "../domain/repository/product.repository";
import { PaginateResponse } from "../../../../contexts/shared/domain/interface/paginate";
import { ProductPaginateRequest } from "../domain/interface/product-paginate.interface";

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

    async getAllProducts({limit=10, page=1, search=""}:ProductPaginateRequest):Promise<PaginateResponse< Partial<Product[]>>> {

        const whereArgs: Prisma.ProductFindManyArgs['where'] ={
            deletedAt: null,
        }

        if(search) {
            whereArgs.name = {
                contains: search,
                mode: "insensitive"
            }
        }
        const [items, total_count]= await this.db.$transaction([
            this.db.product.findMany({
                where: whereArgs,
                take: limit,
                skip: (page - 1) * limit,
                include: {
                    categories: true
                },
                orderBy: {
                    createdAt: "desc"
                },
            }),
            this.db.product.count({
                where: whereArgs
            })
        ])
const total_pages = Math.ceil(total_count / limit);

    return {
      meta: {
        limit,
        total_records: total_count,
        total_pages,
        current_page: page,
        is_first_page: page === 0,
        is_last_page: page === total_pages - 1
      },
      data: items
    };    }
}