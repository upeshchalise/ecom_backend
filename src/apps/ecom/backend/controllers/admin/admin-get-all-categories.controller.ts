import { NextFunction, Response } from "express";
import { AdminGetAllCategoriesService } from "../../../../../contexts/ecom/products/application/admin-get-all-categories.services";
import { Controller } from "../controller";
import { GetUserByIdService } from "../../../../../contexts/ecom/users/application/get-user-by-id.services";
import { UserRole } from "@prisma/client";
import httpStatus from "http-status";
import { MESSAGE_CODES } from "../../../../../contexts/shared/infrastructure/utils/message-code";

export class AdminGetAllCategories implements Controller {
    constructor(private readonly adminGetAllCategoriesService: AdminGetAllCategoriesService,
        private readonly getUserByIdService: GetUserByIdService
    ) { }

    public async invoke(req: any, res: Response, next: NextFunction): Promise<void> {
        try {
            const user_id = req.user.user_id as string

            const user = await this.getUserByIdService.invoke(String(user_id))

            if (!user || user.role !== UserRole.ADMIN) {
                res.status(httpStatus.UNAUTHORIZED).send(MESSAGE_CODES.NOT_AUTHORIZED);
                return;
            }

            const categories = await this.adminGetAllCategoriesService.invoke();
            res.status(httpStatus.OK).send(categories)
        } catch (error) {
            next(error)
        }
    }

}