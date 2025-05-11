import { Request, Response } from "express";
import { Controller } from "../controller";
import { CreateUserService } from "../../../../../contexts/ecom/users/application/create-user.services";
import {  UserRole } from "@prisma/client";
import { HTTP400Error } from "../../../../../contexts/shared/domain/errors/http.exception";
import { hashPassword } from "../../../../../contexts/shared/infrastructure/encryptor/password";
import httpStatus from "http-status";
import { body } from "express-validator";
import { MESSAGE_CODES } from "../../../../../contexts/shared/infrastructure/utils/message-code";
import { isOneOf, RequestValidator } from "../../../../../contexts/shared/infrastructure/middleware/request-validator";
import { GetUserByEmailService } from "../../../../../contexts/ecom/users/application/get-user-by-email.services";


const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const isValidEmail = (value: string) => {
    return emailRegex.test(value);
};

export class CreateUserController implements Controller {

    constructor(private createUserService: CreateUserService,
        private getUserByEmailService: GetUserByEmailService
    ) { }

    public validate = [
        body('email').exists().withMessage(MESSAGE_CODES.USER.INVALID_EMAIL).custom(value => {
            if (!isValidEmail(value)) {
                throw new Error(MESSAGE_CODES.USER.INVALID_EMAIL);
            }
            return true;
        }),
        body('password')
            .exists()
            .withMessage(MESSAGE_CODES.USER.REQUIRED_PASSWORD)
            .isLength({ min: 6 })
            .withMessage(MESSAGE_CODES.USER.PASSWORD_MIN_LENGTH),
        body('first_name').exists().withMessage(MESSAGE_CODES.USER.INVALID_FIRST_NAME).isString().withMessage(MESSAGE_CODES.USER.INVALID_FIRST_NAME).notEmpty().withMessage(MESSAGE_CODES.USER.INVALID_FIRST_NAME),
        body('last_name').exists().withMessage(MESSAGE_CODES.USER.INVALID_LAST_NAME).isString().withMessage(MESSAGE_CODES.USER.INVALID_LAST_NAME).notEmpty().withMessage(MESSAGE_CODES.USER.INVALID_LAST_NAME),
        body('role').optional().exists().withMessage(MESSAGE_CODES.USER.INVALID_ROLE).custom(isOneOf(UserRole, MESSAGE_CODES.USER.INVALID_ROLE)).bail(),
        body('address').exists().withMessage(MESSAGE_CODES.USER.INVALID_ADDRESS).isString().withMessage(MESSAGE_CODES.USER.INVALID_ADDRESS).notEmpty().withMessage(MESSAGE_CODES.USER.INVALID_ADDRESS),
        body('image').optional(),
        body('phone').exists().withMessage(MESSAGE_CODES.USER.INVALID_CONTACT).isString().withMessage(MESSAGE_CODES.USER.INVALID_CONTACT).notEmpty().withMessage(MESSAGE_CODES.USER.INVALID_CONTACT),
        RequestValidator
    ]

    public async invoke(req: Request, res: Response): Promise<void> {
        const { first_name, last_name, email, password, address, role, image, phone } = req.body;
        try {

            const isUser = await this.getUserByEmailService.invoke(email.toLowerCase());

            if (isUser) {
                throw new HTTP400Error(MESSAGE_CODES.USER.USER_ALREADY_EXISTS)
            }
            const hashedPassword = hashPassword(password)

            await this.createUserService.invoke({
                firstName: first_name,
                lastName: last_name,
                email: email.toLowerCase(),
                password: hashedPassword,
                address,
                role: role ?? UserRole.BUYER,
                image,
                phone,

            })
            res.status(httpStatus.CREATED).send();
        } catch (error) {
            res.status(500).json({ message: `Internal server error: ${error}` });
        }
    }
}