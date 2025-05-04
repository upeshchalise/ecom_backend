import { PrismaClient, UserRole } from "@prisma/client";
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
                roles: Array.from(new Set([role])),
            }
        })
    }
}