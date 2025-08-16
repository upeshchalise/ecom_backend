import { Request, Response, NextFunction } from "express";
import { Controller } from "../controller";
import { GetUserByIdService } from "../../../../../contexts/ecom/users/application/get-user-by-id.services";
import { MESSAGE_CODES } from "../../../../../contexts/shared/infrastructure/utils/message-code";
import { UpdateUserServices } from "../../../../../contexts/ecom/users/application/update-user.services";
import { body } from "express-validator";
import { RequestValidator } from "../../../../../contexts/shared/infrastructure/middleware/request-validator";

export class UpdateUserController implements Controller {
    constructor(
        private readonly getUserByIdService: GetUserByIdService,
        private readonly updateUserServices: UpdateUserServices

    ) { }

    public validate = [
            body('first_name').exists().withMessage(MESSAGE_CODES.USER.INVALID_FIRST_NAME).isString().withMessage(MESSAGE_CODES.USER.INVALID_FIRST_NAME).notEmpty().withMessage(MESSAGE_CODES.USER.INVALID_FIRST_NAME),
            body('last_name').exists().withMessage(MESSAGE_CODES.USER.INVALID_LAST_NAME).isString().withMessage(MESSAGE_CODES.USER.INVALID_LAST_NAME).notEmpty().withMessage(MESSAGE_CODES.USER.INVALID_LAST_NAME),
            body('address').exists().withMessage(MESSAGE_CODES.USER.INVALID_ADDRESS).isString().withMessage(MESSAGE_CODES.USER.INVALID_ADDRESS).notEmpty().withMessage(MESSAGE_CODES.USER.INVALID_ADDRESS),
            body('image').optional(),
            body('phone').exists().withMessage(MESSAGE_CODES.USER.INVALID_CONTACT).isString().withMessage(MESSAGE_CODES.USER.INVALID_CONTACT).notEmpty().withMessage(MESSAGE_CODES.USER.INVALID_CONTACT),
            RequestValidator
        ]

    public async invoke(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.params.userId;
            const userData = req.body;

            const userExists = await this.getUserByIdService.invoke(userId);
            if (!userExists) {
                 res.status(404).send(MESSAGE_CODES.USER.USER_NOT_FOUND);
                 return;
            }

            await this.updateUserServices.invoke({
                id: userId,
                ...userData,
            })

            res.status(200).send();
        } catch (error) {
            next(error);
        }

    }
}