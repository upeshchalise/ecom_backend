import { GetProductsByCategoryServices } from "../../../../../contexts/ecom/products/application/get-products-by-category.services";
import { Controller } from "../controller";
import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { GetCategoryById } from "../../../../../contexts/ecom/products/application/get-category-by-id.services";
import { param } from "express-validator";
import { MESSAGE_CODES } from "../../../../../contexts/shared/infrastructure/utils/message-code";
import { RequestValidator } from "../../../../../contexts/shared/infrastructure/middleware/request-validator";

export class GetProductsByCategoryController implements Controller {
    constructor(private readonly getProductsByCategoryServices: GetProductsByCategoryServices,
        private readonly getCategoryById: GetCategoryById
    ) { }

    public validate = [
                param('categoryId').exists().withMessage(MESSAGE_CODES.CATEGORY.INVALID_CATEGORY).isUUID().withMessage(MESSAGE_CODES.CATEGORY.INVALID_CATEGORY).bail(),
                RequestValidator
            ]

    async invoke(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const isCatagory = await this.getCategoryById.invoke(req.params.categoryId);
            if(!isCatagory) {
                res.status(httpStatus.BAD_REQUEST).send("Category does not exist")
                return
            }
            const products = await this.getProductsByCategoryServices.invoke(req.params.categoryId);
            res.status(httpStatus.OK).send(products)
        } catch (error) {
            next(error)
        }
    }
}