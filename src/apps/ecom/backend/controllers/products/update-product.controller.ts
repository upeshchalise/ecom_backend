import { NextFunction, Response } from "express";
import { Controller } from "../controller";
import { GetUserByIdService } from "../../../../../contexts/ecom/users/application/get-user-by-id.services";
import { MESSAGE_CODES } from "../../../../../contexts/shared/infrastructure/utils/message-code";
import { GetProductByIdServices } from "../../../../../contexts/ecom/products/application/get-product-by-id.services";
import { UpdateProductService } from "../../../../../contexts/ecom/products/application/update-product.services";
import { body } from "express-validator";
import { RequestValidator } from "../../../../../contexts/shared/infrastructure/middleware/request-validator";

export class UpdateProductController implements Controller {
    constructor(
        private readonly getUserByIdService: GetUserByIdService,
        private readonly getProductByIdServices: GetProductByIdServices,
        private readonly updateProductService: UpdateProductService

    ) { }

     public validate = [
            body("name").exists().withMessage(MESSAGE_CODES.PRODUCT.INVALID_PRODUCT_NAME).isString().withMessage(MESSAGE_CODES.PRODUCT.INVALID_PRODUCT_NAME).notEmpty().withMessage(MESSAGE_CODES.PRODUCT.INVALID_PRODUCT_NAME),
            body("description").exists().withMessage(MESSAGE_CODES.PRODUCT.INVALID_PRODUCT_DESCRIPTION).isString().withMessage(MESSAGE_CODES.PRODUCT.INVALID_PRODUCT_DESCRIPTION).notEmpty().withMessage(MESSAGE_CODES.PRODUCT.INVALID_PRODUCT_DESCRIPTION),
            body("price").exists().withMessage(MESSAGE_CODES.PRODUCT.INVALID_PRODUCT_PRICE).isNumeric().withMessage(MESSAGE_CODES.PRODUCT.INVALID_PRODUCT_PRICE),
            body("quantity").exists().withMessage(MESSAGE_CODES.PRODUCT.INVALID_PRODUCT_QUANTITY).isNumeric().withMessage(MESSAGE_CODES.PRODUCT.INVALID_PRODUCT_QUANTITY),
            body("image").optional(),
            body("category_ids").exists().withMessage(MESSAGE_CODES.PRODUCT.INVALID_PRODUCT_CATEGORY_ID).isArray().withMessage(MESSAGE_CODES.PRODUCT.INVALID_PRODUCT_CATEGORY_ID),
            body("category_ids.*").exists().withMessage(MESSAGE_CODES.PRODUCT.INVALID_PRODUCT_CATEGORY_ID).isUUID().withMessage(MESSAGE_CODES.PRODUCT.INVALID_PRODUCT_CATEGORY_ID).bail(),
            RequestValidator
        ]
    public async invoke(req: any, res: Response, next: NextFunction): Promise<void> {
        try {
            const user_id = req.user.user_id as string
            const user = await this.getUserByIdService.invoke(user_id);
            if (!user) {
                res.status(404).send(MESSAGE_CODES.USER.USER_NOT_FOUND);
                return;
            }
            const product = await this.getProductByIdServices.invoke(req.params.productId);
            if (!product) {
                res.status(404).send(MESSAGE_CODES.PRODUCT.PRODUCT_NOT_FOUND);
                return;
            }

            if (product.userId !== user_id) {
                res.status(403).send(MESSAGE_CODES.NOT_AUTHORIZED);
                return;
            }
            await this.updateProductService.invoke(product.id!, req.body);
            res.status(200).send();
        } catch (error) {
            next(error);
        }
    }

}