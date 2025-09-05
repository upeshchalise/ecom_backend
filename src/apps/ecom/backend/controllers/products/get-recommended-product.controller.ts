import { GetRecommendedProductServices } from "../../../../../contexts/ecom/products/application/get-recommended-product.services";
import { Controller } from "../controller";
import { NextFunction, Response } from "express";
import { GetUserByIdService } from "../../../../../contexts/ecom/users/application/get-user-by-id.services";
import { MESSAGE_CODES } from "../../../../../contexts/shared/infrastructure/utils/message-code";

export class GetRecommendedProductController implements Controller {
    constructor(private readonly getRecommendedProductServices: GetRecommendedProductServices,
        private readonly getUserByIdService: GetUserByIdService,

    ) { }

    public async invoke(req: any, res: Response, next: NextFunction): Promise<void> {

        try {
            console.log("req user ===>")
            const user_id = req.user.user_id as string;
            const user = await this.getUserByIdService.invoke(user_id);
            if (!user) {
                res.status(404).send(MESSAGE_CODES.USER.USER_NOT_FOUND);
                return;
            }
            const categoriesFilter = req.query.categories ? (req.query.categories as string).split(",") : []

            const recommendedProducts = await this.getRecommendedProductServices.invoke(user.id!, {
                limit: Number(req.query.pageSize),
                page: Number(req.query.page),
                search: req.query.search as string,
                categories: categoriesFilter
            });
            res.status(200).send(recommendedProducts);
        } catch (error) {
            next(error)
        }
    }
}