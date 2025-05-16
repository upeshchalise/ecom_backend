import { Request, Response } from "express";
import { Controller } from "../controller";
import { HTTP400Error } from "../../../../../contexts/shared/domain/errors/http.exception";
import httpStatus from "http-status";
import {  param } from "express-validator";
import { MESSAGE_CODES } from "../../../../../contexts/shared/infrastructure/utils/message-code";
import {  RequestValidator } from "../../../../../contexts/shared/infrastructure/middleware/request-validator";
import { GetUserByIdService } from "../../../../../contexts/ecom/users/application/get-user-by-id.services";

export class GetUserByIdController implements Controller {

    constructor(
        private readonly getUserByIdService: GetUserByIdService
    ) {}

    public validate = [
        param('id').exists().withMessage(MESSAGE_CODES.USER.INVALID_USER_ID).isUUID().withMessage(MESSAGE_CODES.USER.INVALID_USER_ID).bail(),
        RequestValidator
    ]

    public async invoke(req: Request, res: Response): Promise<void> {
        try {

            const isUser = await this.getUserByIdService.invoke(req.params.id!);

            if (!isUser) {
                throw new HTTP400Error(MESSAGE_CODES.USER.USER_NOT_FOUND)
            }

            res.status(httpStatus.CREATED).json({ message: "User created successfully" });
        } catch (error) {
            res.status(500).json({ message: `Internal server error: ${error}` });
        }
    }
}