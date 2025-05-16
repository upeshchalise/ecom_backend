import { Category, Prisma, PrismaClient, Product } from "@prisma/client";
import { IProductRepository } from "../domain/repository/product.repository";
import { PaginateResponse } from "../../../../contexts/shared/domain/interface/paginate";
import { ProductPaginateRequest } from "../domain/interface/product-paginate.interface";

export class PrismaProductRepository implements IProductRepository {
    constructor(
        private readonly db: PrismaClient
    ) { }

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
            select: {
                id: true,
                name: true
            }
        })
    }

    async getAllProducts({ limit = 10, page = 1, search = "" }: ProductPaginateRequest): Promise<PaginateResponse<Partial<Product[]>>> {
        const whereArgs: Prisma.ProductFindManyArgs['where'] = {
            deletedAt: null,
        }

        if (search) {
            whereArgs.name = {
                contains: search,
                mode: "insensitive"
            }
        }
        const [items, total_count] = await this.db.$transaction([
            this.db.product.findMany({
                where: whereArgs,
                skip: (Number(page) - 1) * Number(limit),
                take: Number(limit),
                include: {
                    categories: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                },
            }),
            this.db.product.count({
                where: whereArgs
            })
        ])
        const total_pages = Math.ceil(total_count / Number(limit));

        return {
            meta: {
                limit,
                total_records: total_count,
                total_pages,
                current_page: page,
                is_first_page: page === 1,
                is_last_page: page === total_pages - 1
            },
            data: items
        };
    }

    async getProductById(id: string): Promise<Partial<Product> | null> {
        return await this.db.product.findFirst({
            where: {
                id
            },
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                image: true,
                categories: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })
    }
}