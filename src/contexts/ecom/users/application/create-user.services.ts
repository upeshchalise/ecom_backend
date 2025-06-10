import { CreateUserRequest } from "../domain/interface/create-user.interface";
import { IUserRepository } from "../domain/repository/user.repository";

export class CreateUserService {
    constructor(private readonly userRepository: IUserRepository) {}
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