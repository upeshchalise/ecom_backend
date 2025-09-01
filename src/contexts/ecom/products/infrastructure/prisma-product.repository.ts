import { Category, InteractionType, Prisma, PrismaClient, Product } from "@prisma/client";
import { IProductRepository } from "../domain/repository/product.repository";
import { PaginateResponse } from "../../../../contexts/shared/domain/interface/paginate";
import { CategoryIds, ProductPaginateRequest, SalesAnalytics } from "../domain/interface/product-paginate.interface";

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

    async createProduct(name: string, description: string, price: number, image: string, quantity: number,userId: string, categoryIds: string[]): Promise<void> {
        await this.db.product.create({
            data: {
                name,
                description,
                price,
                image,
                quantity,
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
                name: true,
            }
        })
    }

    async getAllProducts({ limit = 10, page = 1, search = "", categories = [] }: ProductPaginateRequest): Promise<PaginateResponse<Partial<Product[]>>> {
        const whereArgs: Prisma.ProductFindManyArgs['where'] = {
            deletedAt: null,
        }

        if (search) {
            whereArgs.name = {
                contains: search,
                mode: "insensitive"
            }
        }

        if (
            categories && categories.length > 0
        ) {
            whereArgs.categories = {
                some: {
                    name: {
                        in: categories
                    }
                }
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
                quantity: true,
                categories: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        image: true
                    }
                }
            }
        })
    }

    async getAllCategories(): Promise<Partial<Category[]>> {
        return await this.db.category.findMany({
            select: {
                id: true,
                name: true,
                createdAt: true,
                updatedAt: true,
                deletedAt: true,
                _count: {
                    select: {
                        products: {
                            where: {

                            }
                        }
                    }
                }
            }
        })
    }

    async adminGetAllCategories(): Promise<Partial<Category[]>> {
        return await this.db.category.findMany({
            select: {
                id: true,
                name: true,
                deletedAt: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: {
                        products: {
                            where: {
                                deletedAt: null
                            }
                        }
                    }
                }
            }
        })
    }

    async getProductsByCategory(categoryId: string): Promise<Partial<Product[]>> {
        return await this.db.product.findMany({
            where: {
                categories: {
                    some: {
                        id: categoryId
                    }
                }
            }
        })
    }

    async getCategoryByName(name: string): Promise<Partial<Category> | null> {
        return await this.db.category.findFirst({
            where: {
                name: {
                    equals: name,
                    mode: "insensitive"
                }
            }
        })
    }

    async getProductsByCategoryId(id: string, search = "", page = 1, limit = 10): Promise<PaginateResponse<Partial<Product[]>>> {
        const whereArgs: Prisma.ProductFindManyArgs['where'] = {
            deletedAt: null,
            categories: {
                some: {
                    id
                }
            }
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
                skip: (page - 1) * limit,
                take: limit,
                orderBy: {
                    createdAt: "desc"
                }
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
                is_first_page: page === 1,
                is_last_page: page === total_pages - 1
            },
            data: items
        };
    }

    async salesAnalysis(endDate: string): Promise<SalesAnalytics> {

        let queryDate;
        if (endDate) {
            const date = new Date();
            queryDate = new Date();
            queryDate.setDate(date.getDate() - Number(endDate));
            queryDate.setHours(0, 0, 0, 0);
        }
        const whereArgs: Prisma.OrderFindManyArgs = {
            where: {
                createdAt: {
                    gte: queryDate
                }
            },
            select: {
                totalAmount: true,
                id: true,
                status: true,
            },
            orderBy: {
                createdAt: "desc"
            },
        }

        if (!endDate) {
            whereArgs.where = {}
        }
        const [sales, count, users] = await this.db.$transaction([
            this.db.order.findMany(whereArgs),
            this.db.order.count({ where: whereArgs.where }),
            this.db.order.findMany({
                where: {
                    ...whereArgs.where,
                },
                distinct: ['userId'],
                select: {
                    userId: true
                }
            })
        ])
        const total_sales = sales.reduce((acc, order) => acc + Number(order.totalAmount), 0)

        return { total_sales, count, users: users.length };
    }

    async updateRecommendationTable(userId: string, categoryIds: string[], interactionType: InteractionType): Promise<void> {
        for (const categoryId of categoryIds) {
            const data = await this.db.userInteractedCategory.findFirst({
                where: {
                    userId,
                    categoryId,
                    interactionType
                }
            })

            if (data) {
                await this.db.userInteractedCategory.update({
                    where: {
                        id: data.id
                    },
                    data: {
                        interactionCount: (data?.interactionCount || 0) + 1
                    }
                })
            } else {
                await this.db.userInteractedCategory.create({
                    data: {
                        userId,
                        categoryId,
                        interactionType,
                    }
                })
            }
        }
    }

    async getCategoriesIdByProductId(productId: string): Promise<CategoryIds | null> {
        return await this.db.product.findFirst({
            where : {
                id: productId
            },
            select: {
                categories: {
                    select: {
                        id: true
                    }
                }
            }
        })
     }

    // async getRecommendedProducts(userId: string): Promise<Partial<Product[]>> {
    async getRecommendedProducts(userId: string): Promise<any> {
        const userInteractedCategories = await this.db.userInteractedCategory.findMany({
            where: {
                userId
            },
            select: {
                categoryId: true,
                interactionType: true,
                interactionCount: true
            }
        })

        const categories = userInteractedCategories.map(i => i.categoryId);
        console.log("categories ", categories)

        const otherUsersWithCategories = await this.db.userInteractedCategory.findMany({
            where: {
                categoryId: {
                    in: categories
                },
            NOT: {
                userId
            }
            }
        })
        console.log("userid", userId, "other users ", otherUsersWithCategories)

        const otherUsersCategories = await this.db.userInteractedCategory.findMany({
            where: {
                userId: {
                    in: otherUsersWithCategories.map(i => i.userId)
                },
                categoryId: {
                    notIn: categories
                }
            }
        })
        console.log("other users categories", otherUsersCategories)
        const recommendedCategories = otherUsersCategories.map(i => i.categoryId)
        const recommendedProducts = await this.db.product.findMany({
            where: {
                categories: {
                    some: {
                        id: {
                            in: recommendedCategories
                        }
                    }
                }
            },
           omit: {
            createdAt: true,
            updatedAt: true,
            deletedAt: true,
           }
        })
        console.log("recommended products", recommendedProducts)
        return recommendedProducts
    }
}
