import { NextFunction, Response } from "express";
import { Controller } from "../controller";
import { AdminGetAllProductsByCategoryIdService } from "../../../../../contexts/ecom/products/application/admin-get-all-products-by-category-id.services";
import httpStatus from "http-status";
import { GetUserByIdService } from "../../../../../contexts/ecom/users/application/get-user-by-id.services";
import { UserRole } from "@prisma/client";
import { MESSAGE_CODES } from "../../../../../contexts/shared/infrastructure/utils/message-code";


export class AdminGetProductsByCategoryIdController implements Controller {

    constructor(
        private readonly adminGetAllProductsByCategoryIdService: AdminGetAllProductsByCategoryIdService,
                private readonly getUserByIdService: GetUserByIdService
    ){}
    public async invoke(req: any, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const user_id = req.user.user_id as string
            const {search, page, pageSize} = req.query

            const user = await this.getUserByIdService.invoke(String(user_id))

            if (!user || user.role !== UserRole.ADMIN) {
                res.status(httpStatus.UNAUTHORIZED).send(MESSAGE_CODES.NOT_AUTHORIZED);
                return;
            }
            const products = await this.adminGetAllProductsByCategoryIdService.invoke(id, search, Number(page), Number(pageSize));
            res.status(httpStatus.OK).send(products);
        } catch (error) {
            next(error);
        }
    }
}