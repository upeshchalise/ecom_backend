import { Request, Response, NextFunction } from "express";
import { Controller } from "../controller";
import { AdminCreateCategoryService } from "../../../../../contexts/ecom/products/application/admin-create-category.services";
import { body } from "express-validator";
import { MESSAGE_CODES } from "../../../../../contexts/shared/infrastructure/utils/message-code";
import { RequestValidator } from "../../../../../contexts/shared/infrastructure/middleware/request-validator";
import { GetUserByIdService } from "../../../../../contexts/ecom/users/application/get-user-by-id.services";
import httpStatus from "http-status";
import { UserRole } from "@prisma/client";

export class AdminCreateCategoryController implements Controller {

    constructor(
        private adminCreateCategoryService: AdminCreateCategoryService,
        private getUserByIdService: GetUserByIdService

    ) { }

    public validate = [
        body('name').exists().withMessage(MESSAGE_CODES.PRODUCT.INVALID_CATEGORY_NAME).isString().withMessage(MESSAGE_CODES.USER.INVALID_CONTACT).notEmpty().withMessage(MESSAGE_CODES.PRODUCT.INVALID_CATEGORY_NAME),
        RequestValidator
    ]
    public async invoke(req: any, res: Response, next: NextFunction): Promise<void> {
        try {
        const user_id = req.user.user_id as string
        // console.log("req.body", user_id.user_id);
        

        const user = await this.getUserByIdService.invoke(String(user_id))

        if (!user || user.role !== UserRole.ADMIN) {
            res.status(httpStatus.UNAUTHORIZED).send(MESSAGE_CODES.NOT_AUTHORIZED);
            return;
        }

        const { name } = req.body;
            await this.adminCreateCategoryService.invoke(name);
            res.status(httpStatus.CREATED).send();
        } catch (error) {
            console.log(error,"errrrr");
            next(error);

        }
    }
}