import { Prisma, PrismaClient, User, UserRole } from "@prisma/client";
import { IUserRepository } from "../domain/repository/user.repository";
import { PaginateRequest, PaginateResponse } from "src/contexts/shared/domain/interface/paginate";

export class PrismaUserRepository implements IUserRepository {
    constructor(private readonly db: PrismaClient){}

    async createUser(firstName: string, lastName: string, email: string, password: string, address: string, role: UserRole, image?: string, phone?: string):Promise<void> {
        await this.db.user.create({
            data: {
                firstName,
                lastName,
                email,
                password,
                address,
                role,
                image,
                phone,
            }
        })
    }

    async updateUser(
        id: string,
        firstName?: string,
        lastName?: string,
        image?: string,
        phone?: string,
        address?: string,
    ): Promise<void> {
        await this.db.user.update({
            where: { id },
            data: {
                firstName,
                lastName,
                image,
                phone,
                address,
            }
        })
    }
    async getUserByEmail(email: string): Promise<Partial<User> | null> {
        return await this.db.user.findFirst({
            where: {
                email
            },
            select : {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                address: true,
                image: true,
                phone: true,
                password: true,
                role: true,
            }
        })
    }

    async getUserById(id: string): Promise<Partial<User> | null> {
        return await this.db.user.findFirst({
            where: {
                id
            },
            select : {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                address: true,
                image: true,
                phone: true,
                role: true,
            }
        })
    }

    async adminGetAllUsers(id: string, { limit=20, page=1, search }: PaginateRequest): Promise<PaginateResponse<Partial<User>[]>> {

        const whereArgs: Prisma.UserFindManyArgs = {
            where: {
                id: {
                    not: id
                }
            }, omit: {
                password: true,
                createdAt: true,
                updatedAt: true,
                deletedAt: true,
            },
            orderBy: {
                firstName: 'asc'
            },
            take: limit,
            skip: (Number(page) - 1) * Number(limit)
        }

        if(search) {
            whereArgs.where ={
                OR: [
                    {
                        firstName: {
                            contains: search,
                            mode: 'insensitive'
                        }
                    },
                    {
                        lastName: {
                            contains: search,
                            mode: 'insensitive'
                        }
                    }
                ]
            }
        }

        const users = await this.db.user.findMany(whereArgs)
        const total_count = await this.db.user.count({
            where: whereArgs.where
        })
        const total_pages = Math.ceil(total_count / Number(limit))
        return {
            meta: {
                limit: Number(limit),
                total_records: total_count,
                total_pages,
                current_page: Number(page),
                is_first_page: page === 1,
                is_last_page: page === total_pages - 1
            },
            data: users
        };
    }
}