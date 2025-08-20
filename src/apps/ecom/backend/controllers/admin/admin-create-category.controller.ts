import {  Response, NextFunction } from "express";
import { Controller } from "../controller";
import { AdminCreateCategoryService } from "../../../../../contexts/ecom/products/application/admin-create-category.services";
import { body } from "express-validator";
import { MESSAGE_CODES } from "../../../../../contexts/shared/infrastructure/utils/message-code";
import { RequestValidator } from "../../../../../contexts/shared/infrastructure/middleware/request-validator";
import { GetUserByIdService } from "../../../../../contexts/ecom/users/application/get-user-by-id.services";
import httpStatus from "http-status";
import { UserRole } from "@prisma/client";
import { GetCategoryByName } from "../../../../../contexts/ecom/products/application/get-category-by-name.services";

export class AdminCreateCategoryController implements Controller {

    constructor(
        private readonly adminCreateCategoryService: AdminCreateCategoryService,
        private readonly getUserByIdService: GetUserByIdService,
        private readonly getCategoryByName: GetCategoryByName
    ) { }

    public validate = [
        body('name').exists().withMessage(MESSAGE_CODES.PRODUCT.INVALID_CATEGORY_NAME).isString().withMessage(MESSAGE_CODES.USER.INVALID_CONTACT).notEmpty().withMessage(MESSAGE_CODES.PRODUCT.INVALID_CATEGORY_NAME),
        RequestValidator
    ]
    public async invoke(req: any, res: Response, next: NextFunction): Promise<void> {
        try {
            const user_id = req.user.user_id as string

            const user = await this.getUserByIdService.invoke(String(user_id))

            if (!user || user.role !== UserRole.ADMIN) {
                res.status(httpStatus.UNAUTHORIZED).send(MESSAGE_CODES.NOT_AUTHORIZED);
                return;
            }

            const { name } = req.body;
            const category = await this.getCategoryByName.invoke(name?.toLowerCase())
            if (category) {
                res.status(httpStatus.BAD_REQUEST).send(`Category "${name}" already exists`)
                return
            }

            await this.adminCreateCategoryService.invoke(name?.toLowerCase());
            res.status(httpStatus.CREATED).send();
        } catch (error) {
            console.log(error, "errrrr");
            next(error);

        }
    }
}