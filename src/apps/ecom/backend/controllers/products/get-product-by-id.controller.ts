import { Request, Response, NextFunction } from "express";
import { Controller } from "../controller";
import httpStatus from "http-status";
import { GetProductByIdServices } from "../../../../../contexts/ecom/products/application/get-product-by-id.services";
import { param } from "express-validator";
import { MESSAGE_CODES } from "../../../../../contexts/shared/infrastructure/utils/message-code";
import { RequestValidator } from "../../../../../contexts/shared/infrastructure/middleware/request-validator";

export class GetProductByIdController implements Controller{
    constructor(private readonly getProductByIdServices: GetProductByIdServices){}

     public validate = [
            param('productId').exists().withMessage(MESSAGE_CODES.PRODUCT.INVALID_PRODUCT_ID).isUUID().withMessage(MESSAGE_CODES.PRODUCT.INVALID_PRODUCT_ID).bail(),
            RequestValidator
        ]
    public async invoke(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const product = await this.getProductByIdServices.invoke(req.params.productId);
            res.status(httpStatus.OK).send(product)
        } catch (error) {
            next(error)
        }
    }
}