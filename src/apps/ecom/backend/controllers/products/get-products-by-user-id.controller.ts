import { NextFunction, Response } from "express";
import { Controller } from "../controller";
import { GetUserByIdService } from "../../../../../contexts/ecom/users/application/get-user-by-id.services";
import { GetProductByUserIdServices } from "../../../../../contexts/ecom/products/application/get-product-by-user-id.services";
import httpStatus from "http-status";


export class GetProductsByUserIdController implements Controller {
    constructor(
                private readonly getUserByIdService: GetUserByIdService,
                private readonly getProductByUserIdServices:GetProductByUserIdServices
    ) {}
    public async invoke(req: any, res: Response, next: NextFunction): Promise<void> {
        try {
            const user_id = req.user.user_id as string;
            const user = await this.getUserByIdService.invoke(user_id);
            if(!user) {
                res.status(404).send({ message: "User not found" });
                return;
            }

            const products = await this.getProductByUserIdServices.invoke(user_id, {
                page: req.query.page,
                search: req.query.search,
                limit: req.query.limit
            })
            res.status(httpStatus.OK).send(products)
        } catch (error) {
            next(error);
        }
    }
}