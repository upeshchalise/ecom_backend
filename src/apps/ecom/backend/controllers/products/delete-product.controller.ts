import { NextFunction, Response } from "express";
import { Controller } from "../controller";
import { GetUserByIdService } from "../../../../../contexts/ecom/users/application/get-user-by-id.services";
import { MESSAGE_CODES } from "../../../../../contexts/shared/infrastructure/utils/message-code";
import { GetProductByIdServices } from "../../../../../contexts/ecom/products/application/get-product-by-id.services";
import { DeleteProductService } from "../../../../../contexts/ecom/products/application/delete-product.services";
import httpStatus from "http-status";

export class DeleteProductController implements Controller {
    constructor(
        private readonly getUserByIdService: GetUserByIdService,
        private readonly getProductByIdServices: GetProductByIdServices,
        private readonly deleteProductService: DeleteProductService

    ) { }
    public async invoke(req: any, res: Response, next: NextFunction): Promise<void> {
        try {
            const user_id = req.user.user_id as string
            const user = await this.getUserByIdService.invoke(user_id);
            if (!user) {
                res.status(httpStatus.NOT_FOUND).send(MESSAGE_CODES.USER.USER_NOT_FOUND);
                return;
            }
            const product = await this.getProductByIdServices.invoke(req.params.productId);
            if (!product || product.deletedAt !== null) {
                res.status(httpStatus.NOT_FOUND).send(MESSAGE_CODES.PRODUCT.PRODUCT_NOT_FOUND);
                return;
            }

            if (product.userId !== user_id) {
                res.status(httpStatus.FORBIDDEN).send(MESSAGE_CODES.NOT_AUTHORIZED);
                return;
            }
            await this.deleteProductService.invoke(product.id!);
                        res.status(httpStatus.OK).send();

        } catch (error) {
            next(error);
        }
    }

}