import { NextFunction, Response } from "express";
import { Controller } from "../controller";
import { GetUserByIdService } from "../../../../../contexts/ecom/users/application/get-user-by-id.services";
import { MESSAGE_CODES } from "src/contexts/shared/infrastructure/utils/message-code";
import { RequestValidator } from "src/contexts/shared/infrastructure/middleware/request-validator";
import { query } from "express-validator";

export class UpdateRecommendationTable implements Controller {
    constructor(
        private readonly getUserByIdService: GetUserByIdService

    ) { }

    public validate = [
           query('categoryIds').exists().withMessage('Category ID is required').isArray().withMessage('Category ID must be an array'),
           query('categoryIds.*').isUUID().withMessage('Category ID must be a valid UUID'),
           query('interactionType').exists().withMessage('Interaction type is required').isIn(['VIEW', 'CART', 'PURCHASE']).withMessage('Interaction type must be one of view, cart, purchase'),
           RequestValidator
       ]
    public async invoke(req: any, res: Response, next: NextFunction): Promise<void> {
        try {
            const user_id = req.user.user_id as string;
            const {categoryIds, interactionType} = req.query;
            if (!user_id) {
                res.status(200).send();
                return;
            }

            const user = await this.getUserByIdService.invoke(user_id);
            if (!user) {
                res.status(404).send(MESSAGE_CODES.USER.USER_NOT_FOUND);
                return;
            }



        } catch (error) {
            next(error);
        }
    }
}