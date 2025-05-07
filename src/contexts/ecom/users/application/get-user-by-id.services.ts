import { User } from "@prisma/client";
import { PrismaUserRepository } from "../infrastructure/prisma-user.repository";

export class GetUserByIdService {
    constructor(private userRepository: PrismaUserRepository){}
    async invoke(id: string): Promise<Partial<User> | null> {
        return this.userRepository.getUserByEmail(id)
    }
}