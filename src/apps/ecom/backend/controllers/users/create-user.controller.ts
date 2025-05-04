import { Request, Response } from "express";
import { Controller } from "../controller";
import { CreateUserService } from "../../../../../contexts/ecom/users/application/create-user.services";
import { PrismaClient } from "@prisma/client";
import { HTTP400Error } from "../../../../../contexts/shared/domain/errors/http.exception";
import { hashPassword } from "../../../../../contexts/shared/infrastructure/encryptor/password";
import httpStatus from "http-status";

export class CreateUserController implements Controller {

    constructor(private createUserService: CreateUserService,
        private db: PrismaClient
    ){}

    public async invoke(req:Request,res:Response):Promise<void> {
        const {firstName, lastName, email, password, address, role, image, phone} = req.body;
        try {
            const isUser = await this.db.user.findFirst({
                where: {
                    email
                }
            })
        if(isUser) {
            throw new HTTP400Error(`User with email ${email} already exists`)
        }
        const hashedPassword =  hashPassword(password)

        await this.createUserService.invoke({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            address,
            role,
            image,
            phone,

        })
        res.status(httpStatus.CREATED).json({message: "User created successfully"});
        } catch (error) {
            res.status(500).json({message: `Internal server error: ${error}`});
        }
    }
}