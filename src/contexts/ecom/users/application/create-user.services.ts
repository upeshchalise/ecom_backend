import { CreateUserRequest } from "../domain/interface/create-user.interface";
import { IUserRepository } from "../domain/repository/user.repository";
import { PrismaUserRepository } from "../infrastructure/prisma-user.repository";

export class CreateUserService {
    constructor(private userRepository: IUserRepository) {}
    public async invoke(createUserActivity: CreateUserRequest):Promise<void> {
        const { firstName, lastName, email, password, address, role, image, phone } = createUserActivity;
        await this.userRepository.createUser(
            firstName,
            lastName,
            email,
            password,
            address,
            role,
            image,
            phone
        );
    }
}