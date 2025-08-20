import {  Response } from "express";
import { Controller } from "../controller";
import httpStatus from "http-status";
import { GetUserByIdService } from "../../../../../contexts/ecom/users/application/get-user-by-id.services";

export class GetUserByIdController implements Controller {

    constructor(
        private readonly getUserByIdService: GetUserByIdService
    ) {}

    public async invoke(req: any, res: Response): Promise<void> {
        try {
            console.log("GetUserByIdController invoked", req.user.user_id as string);
            const user_id = req.user.user_id as string
            console.log("userid",user_id);
            const isUser = await this.getUserByIdService.invoke(user_id);

            if (!isUser) {
                res.status(httpStatus.NOT_FOUND).send("User not found");
                return;
            }

            res.status(httpStatus.CREATED).send(isUser);
        } catch (error) {
            res.status(500).json({ message: `Internal server error: ${error}` });
        }
    }
}