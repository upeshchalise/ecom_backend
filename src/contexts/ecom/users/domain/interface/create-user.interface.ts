import { UserRole } from "@prisma/client";

export interface CreateUserRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    image?: string;
    phone?: string;
    address: string;
    role: UserRole;
}