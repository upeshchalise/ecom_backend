import {  Response } from "express";
import { Controller } from "../controller";
import { HTTP400Error } from "../../../../../contexts/shared/domain/errors/http.exception";
import httpStatus from "http-status";
import { MESSAGE_CODES } from "../../../../../contexts/shared/infrastructure/utils/message-code";
import { GetUserByIdService } from "../../../../../contexts/ecom/users/application/get-user-by-id.services";

export class GetUserByIdController implements Controller {

    constructor(
        private readonly getUserByIdService: GetUserByIdService
    ) {}

    public async invoke(req: any, res: Response): Promise<void> {
        try {
            // const {user_id} = req.user!

            console.log(req.user)
            const isUser = await this.getUserByIdService.invoke(req.params.id!);

            // if (!isUser) {
            //     throw new HTTP400Error(MESSAGE_CODES.USER.USER_NOT_FOUND)
            // }

            res.status(httpStatus.CREATED).send(isUser);
        } catch (error) {
            res.status(500).json({ message: `Internal server error: ${error}` });
        }
    }
}