import { PaginateRequest, PaginateResponse } from "src/contexts/shared/domain/interface/paginate";
import { IUserRepository } from "../domain/repository/user.repository";
import { User } from "@prisma/client";


export class AdminGetAllUsersService {
    constructor(private readonly userRepository: IUserRepository) {}

    async execute(id: string, request: PaginateRequest): Promise<PaginateResponse<Partial<User>[]>> {
        return await this.userRepository.adminGetAllUsers(id, request);
    }
}