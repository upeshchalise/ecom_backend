import { UpdateUserRequest } from "../domain/interface/create-user.interface";
import { IUserRepository } from "../domain/repository/user.repository";

export class UpdateUserServices {
    constructor(private readonly userRepository: IUserRepository) {}

    public async invoke(updateUserActivity: UpdateUserRequest): Promise<void> {
        const { firstName, lastName, image, phone, address, id } = updateUserActivity;
        await this.userRepository.updateUser(
            id,
            firstName,
            lastName,
            image,
            phone,
            address,
        );
    }
    
}