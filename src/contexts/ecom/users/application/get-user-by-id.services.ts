import { User } from "@prisma/client";
import { PrismaUserRepository } from "../infrastructure/prisma-user.repository";

export class GetUserByIdService {
    constructor(private readonly userRepository: PrismaUserRepository){}
    async invoke(id: string): Promise<Partial<User> | null> {  
        if(!id) {
            return null
        }
        return this.userRepository.getUserById(id)
    }
}   