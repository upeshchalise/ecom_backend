import { UserRole } from "@prisma/client";
import { NextFunction, Response } from "express";
import { GetUserByIdService } from "../../../../../contexts/ecom/users/application/get-user-by-id.services";
import httpStatus from "http-status";
import { MESSAGE_CODES } from "../../../../../contexts/shared/infrastructure/utils/message-code";
import { AdminGetAllUsersService } from "../../../../../contexts/ecom/users/application/admin-get-all-users.services";

export class AdminGetAllUsersController {
    constructor(
        private readonly getUserByIdService: GetUserByIdService,
private readonly adminGetAllUsersService: AdminGetAllUsersService
    ) { }

    public async invoke(req: any, res: Response, next: NextFunction): Promise<void> {
        try {
            const user_id = req.user.user_id as string
            const {pageSize, page, search} = req.query

            const user = await this.getUserByIdService.invoke(String(user_id))

            if (!user || user.role !== UserRole.ADMIN) {
                res.status(httpStatus.UNAUTHORIZED).send(MESSAGE_CODES.NOT_AUTHORIZED);
                return;
            }
            const users = await this.adminGetAllUsersService.execute(user_id, {
                limit: Number(pageSize),
                page: Number(page),
                search: String(search)
            })
            res.status(httpStatus.OK).json(users);
        } catch (error) {
            next(error);
        }
    }
}