import { User, UserRole } from "@prisma/client";

export interface IUserRepository {
    createUser(
        firstName: string,
        lastName: string,
        email: string,
        password: string,
        address: string,
        role: UserRole,
        // roles: UserRole[],
        image?: string,
        phone?: string,
    ): Promise<void>;

    updateUser(
        id: string,
        firstName?: string,
        lastName?: string,
        image?: string,
        phone?: string,
        address?: string,
    ): Promise<void>;

    getUserByEmail(email: string): Promise<Partial<User> | null>;
    getUserById(id: string): Promise<Partial<User> | null>
}