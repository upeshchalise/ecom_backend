import { PrismaClient, User, UserRole } from "@prisma/client";
import { IUserRepository } from "../domain/repository/user.repository";

export class PrismaUserRepository implements IUserRepository {
    constructor(private db: PrismaClient){}

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
}