import { Category, InteractionType, Prisma, PrismaClient, Product } from "@prisma/client";
import { IProductRepository } from "../domain/repository/product.repository";
import { PaginateRequest, PaginateResponse } from "../../../../contexts/shared/domain/interface/paginate";
import { CategoryIds, ProductPaginateRequest, SalesAnalytics, UpdateProductData } from "../domain/interface/product-paginate.interface";

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
                quantity: Number(quantity),
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
        console.log("Fetching product with ID:", id);
        return await this.db.product.findFirst({
            where: {
                id
            },
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                userId: true,
                image: true,
                quantity: true,
                deletedAt: true,
                createdAt: true,
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
    async getRecommendedProducts(userId: string,  {limit=10, page=1, search="", categories=[]} : ProductPaginateRequest): Promise<PaginateResponse<Partial<Product[]>>> {


        // const userInteractedCategories = await this.db.userInteractedCategory.findMany({
        //     where: {
        //         userId
        //     },
        //     select: {
        //         categoryId: true,
        //         interactionType: true,
        //         interactionCount: true
        //     }
        // })

        // const cateogoryList = userInteractedCategories.map(i => i.categoryId);

        // const otherUsersWithCategories = await this.db.userInteractedCategory.findMany({
        //     where: {
        //         categoryId: {
        //             in: cateogoryList
        //         },
        //     NOT: {
        //         userId
        //     }
        //     }
        // })

        // const otherUsersCategories = await this.db.userInteractedCategory.findMany({
        //     where: {
        //         userId: {
        //             in: otherUsersWithCategories.map(i => i.userId)
        //         },
        //         categoryId: {
        //             notIn: cateogoryList
        //         }
        //     }
        // })
        // const recommendedCategories = otherUsersCategories.map(i => i.categoryId)

        // const whereArgs: Prisma.ProductFindManyArgs['where'] = {
        //     deletedAt: null,
        //     userId: {
        //         not: userId
        //     },
        //     quantity: {
        //         gt: 0
        //     }
        // }

        // if (search) {
        //     whereArgs.name = {
        //         contains: search,
        //         mode: "insensitive"
        //     }
        // }
        
        // if (
        //     categories && categories.length > 0
        // ) {
        //     whereArgs.categories = {
        //         some: {
        //             name: {
        //                 in: recommendedCategories
        //             }
        //         }
        //     }
        // }

        // // const recommendedProducts = await this.db.product.findMany({
        // //     where: whereArgs,
        // //    omit: {
        // //     createdAt: true,
        // //     updatedAt: true,
        // //     deletedAt: true,
        // //    }
        // // })

        // const [items, total_count] = await this.db.$transaction([
        //     this.db.product.findMany({
        //     where: whereArgs,
        //     skip: (Number(page) - 1) * Number(limit),
        //         take: Number(limit),
        // //    omit: {
        // //     createdAt: true,
        // //     updatedAt: true,
        // //     deletedAt: true,
        // //    }
        // }),
        //     this.db.product.count({
        //         where: whereArgs
        //     })
        // ])

        //   const total_pages = Math.ceil(total_count / Number(limit));

        // return {
        //     meta: {
        //         limit,
        //         total_records: total_count,
        //         total_pages,
        //         current_page: page,
        //         is_first_page: page === 1,
        //         is_last_page: page === total_pages - 1
        //     },
        //     data: items
        // };

    
   const weights: Record<string, number> = {
        VIEW: 1,
        CART: 3,
        PURCHASE: 5,
    };

    const userInteractions = await this.db.userInteractedCategory.findMany({
        where: { userId },
        select: { categoryId: true, interactionType: true, interactionCount: true }
    });

    if (!userInteractions.length) {
        return this.getAllProducts({page, limit, search, categories});
    }

    const userVector = new Map<string, number>();
    let totalUserInteractions = 0;

    for (const { categoryId, interactionType, interactionCount } of userInteractions) {
        const weight = weights[interactionType] ?? 1;
        const score = interactionCount * weight;
        userVector.set(categoryId, (userVector.get(categoryId) || 0) + score);
        totalUserInteractions += score;
    }

    for (const [cat, val] of userVector.entries()) {
        userVector.set(cat, val / totalUserInteractions);
    }

    const otherUsers = await this.db.userInteractedCategory.findMany({
        where: {
            categoryId: { in: [...userVector.keys()] },
            NOT: { userId }
        }
    });

    const otherUserVectors: Record<string, Map<string, number>> = {};
    const totals: Record<string, number> = {};

    for (const { userId: otherId, categoryId, interactionType, interactionCount } of otherUsers) {
        if (!otherUserVectors[otherId]) otherUserVectors[otherId] = new Map();
        const weight = weights[interactionType] ?? 1;
        const score = interactionCount * weight;
        otherUserVectors[otherId].set(
            categoryId,
            (otherUserVectors[otherId].get(categoryId) || 0) + score
        );
        totals[otherId] = (totals[otherId] || 0) + score;
    }

    for (const [id, vec] of Object.entries(otherUserVectors)) {
        for (const [cat, val] of vec.entries()) {
            vec.set(cat, val / totals[id]);
        }
    }

    function cosineSimilarity(vecA: Map<string, number>, vecB: Map<string, number>): number {
        let dot = 0, normA = 0, normB = 0;
        for (const [cat, valA] of vecA) {
            const valB = vecB.get(cat) || 0;
            dot += valA * valB;
            normA += valA ** 2;
        }
        for (const valB of vecB.values()) normB += valB ** 2;
        return normA && normB ? dot / (Math.sqrt(normA) * Math.sqrt(normB)) : 0;
    }

    const similarUsers = Object.entries(otherUserVectors)
        .map(([id, vec]) => ({ id, score: cosineSimilarity(userVector, vec) }))
        .filter(u => u.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

    if (!similarUsers.length) {
        return this.getAllProducts({page, limit, search, categories});
    }

    const similarUserIds = similarUsers.map(u => u.id);
    const otherUsersCategories = await this.db.userInteractedCategory.findMany({
        where: {
            userId: { in: similarUserIds },
            categoryId: { notIn: [...userVector.keys()] }
        }
    });

    const categoryScores: Record<string, number> = {};
    for (const { userId: otherId, categoryId, interactionType, interactionCount } of otherUsersCategories) {
        const neighbor = similarUsers.find(u => u.id === otherId);
        if (!neighbor) continue;
        const weight = weights[interactionType] ?? 1;
        const score = neighbor.score * interactionCount * weight;
        categoryScores[categoryId] = (categoryScores[categoryId] || 0) + score;
    }

    const rankedCategories = Object.entries(categoryScores)
        .sort((a, b) => b[1] - a[1])
        .map(([cat]) => cat);

    if (!rankedCategories.length) {
        return this.getAllProducts({page, limit, search, categories});
    }

    const products = await this.db.product.findMany({
        where: {
            deletedAt: null,
            quantity: { gt: 0 },
            categories: { some: { id: { in: rankedCategories } } },
            ...(search && { name: { contains: search, mode: "insensitive" } })
        },
        include: { categories: true }
    });

    const scoredProducts = products.map(product => {
        let score = 0;
        for (const cat of product.categories) {
            score += categoryScores[cat.id] || 0;
        }
        return { ...product, relevanceScore: score };
    });

    scoredProducts.sort((a, b) => b.relevanceScore - a.relevanceScore);

    const total_count = scoredProducts.length;
    const total_pages = Math.ceil(total_count / Number(limit));
    const paginated = scoredProducts.slice(
        (Number(page) - 1) * Number(limit),
        Number(page) * Number(limit)
    );

    return {
        meta: {
            limit,
            total_records: total_count,
            total_pages,
            current_page: page,
            is_first_page: page === 1,
            is_last_page: page === total_pages
        },
        data: paginated
    };

    }

   async updateProduct(productId: string, updateData: UpdateProductData): Promise<void> {
       await this.db.product.update({
           where: { id: productId },
           data: {
               name: updateData.name,
               description: updateData.description,
               price: updateData.price,
               image: updateData.image,
               quantity: Number(updateData.quantity),
              categories: {
                set: updateData?.categories?.map(categoryId => ({ id: categoryId }))
            }
           }
       });
   }

   async deleteProduct(productId: string): Promise<void> {
    await this.db.product.update({
        where: {
            id: productId
        },
        data: {
            deletedAt: new Date()
        }
    })
   }

     async getProductsByUserId(userId: string, {search = "", page=1, limit=10}: PaginateRequest): Promise<PaginateResponse<Partial<Product[]>>> {

        const whereArgs: Prisma.ProductFindManyArgs['where'] = {
            deletedAt: null,
            userId
        }

        if(search) {
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
                    createdAt: 'desc'
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
                is_last_page: page === total_count - 1
            },
            data: items
        }
    
     }
}
