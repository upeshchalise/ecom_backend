import { NextFunction, Request, Response } from "express";
import { Controller } from "../controller";
import { GetUserByIdService } from "../../../../../contexts/ecom/users/application/get-user-by-id.services";
import { MESSAGE_CODES } from "../../../../../contexts/shared/infrastructure/utils/message-code";
import { RequestValidator } from "../../../../../contexts/shared/infrastructure/middleware/request-validator";
import { body } from "express-validator";
import { UpdateUserInteractionService } from "../../../../../contexts/ecom/products/application/update-user-interaction.service";
import { UserRole } from "@prisma/client";
import httpStatus from "http-status";
import { GetCategoriesIdByProductIdServices } from "../../../../../contexts/ecom/products/application/get-category-ids-by-product-id.services";


export class UpdateUserInteractionController implements Controller {
    constructor(
        private readonly getUserByIdService: GetUserByIdService,
        private readonly updateUserInteractionService: UpdateUserInteractionService,
        private readonly getCategoriesIdByProductIdServices: GetCategoriesIdByProductIdServices
    ) { }

    public validate = [
           body('productIds').exists().withMessage('Product ID is required').isArray().withMessage('Product ID must be an array').bail(),
           body('productIds.*').isUUID().withMessage('Product ID must be a valid UUID').bail(),
           body('interactionType').exists().withMessage('Interaction type is required').isIn(['VIEW', 'CART', 'PURCHASE']).withMessage('Interaction type must be one of view, cart, purchase').bail(),
           RequestValidator
       ]
    public async invoke(req: any, res: Response, next: NextFunction): Promise<void> {
        try {
            const user_id = req.user.user_id as string;
            const {productIds, interactionType} = req.body;
            if (!user_id) {
                res.status(200).send();
                return;
            }

            let categoriesIds: string[] = [];

            for (const productId of productIds) {
                const ids = await this.getCategoriesIdByProductIdServices.invoke(productId);
                const categoryIds = ids?.categories.map(category => category.id) || [];
                if (ids) {
                    if (!categoriesIds) {
                        categoriesIds = categoryIds;
                    } else {
                        categoriesIds = [...new Set([...categoriesIds, ...categoryIds])];
                    }
                }
            }

            const user = await this.getUserByIdService.invoke(user_id);
            if (!user) {
                res.status(404).send(MESSAGE_CODES.USER.USER_NOT_FOUND);
                return;
            }

            if(user.role === UserRole.USER) {
                await this.updateUserInteractionService.invoke(user_id, categoriesIds, interactionType);
            }
            res.status(httpStatus.OK).send();


        } catch (error) {
            next(error);
        }
    }
}