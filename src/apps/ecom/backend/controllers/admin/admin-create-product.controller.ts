import { NextFunction, Request, Response } from "express";
import { Controller } from "../controller";
import { PrismaClient } from "@prisma/client";
import  httpStatus from "http-status";
import { AdminCreateProductServices } from "../../../../../contexts/ecom/products/application/admin-create-product.services";
import { GetCategoryById } from "../../../../../contexts/ecom/products/application/get-category-by-id.services";
import { body } from "express-validator";
import { MESSAGE_CODES } from "../../../../../contexts/shared/infrastructure/utils/message-code";
import { RequestValidator } from "../../../../../contexts/shared/infrastructure/middleware/request-validator";

export class AdminCreateProductController implements Controller {
        constructor(private db: PrismaClient,
            private adminCreateProductServices: AdminCreateProductServices,
            private getCategoryById: GetCategoryById
        ){}

        public validate = [
            body("name").exists().withMessage(MESSAGE_CODES.PRODUCT.INVALID_PRODUCT_NAME).isString().withMessage(MESSAGE_CODES.PRODUCT.INVALID_PRODUCT_NAME).notEmpty().withMessage(MESSAGE_CODES.PRODUCT.INVALID_PRODUCT_NAME),
            body("description").exists().withMessage(MESSAGE_CODES.PRODUCT.INVALID_PRODUCT_DESCRIPTION).isString().withMessage(MESSAGE_CODES.PRODUCT.INVALID_PRODUCT_DESCRIPTION).notEmpty().withMessage(MESSAGE_CODES.PRODUCT.INVALID_PRODUCT_DESCRIPTION),
            body("price").exists().withMessage(MESSAGE_CODES.PRODUCT.INVALID_PRODUCT_PRICE).isNumeric().withMessage(MESSAGE_CODES.PRODUCT.INVALID_PRODUCT_PRICE),
            body("image").optional(),
            body("category_ids").exists().withMessage(MESSAGE_CODES.PRODUCT.INVALID_PRODUCT_CATEGORY_ID).isArray().withMessage(MESSAGE_CODES.PRODUCT.INVALID_PRODUCT_CATEGORY_ID),
            body("category_ids.*").exists().withMessage(MESSAGE_CODES.PRODUCT.INVALID_PRODUCT_CATEGORY_ID).isUUID().withMessage(MESSAGE_CODES.PRODUCT.INVALID_PRODUCT_CATEGORY_ID).bail(),
            RequestValidator
        ]
    
    async invoke(req:any, res:Response, next:NextFunction): Promise<void> {
        const categoryIds = req.body.category_ids;
        const {name, description, price, image} = req.body;
        const userId = req.user.user_id as string
        console.log(categoryIds);
        try {
            
            const allCategories = await Promise.all(categoryIds?.map(async (id: string) => await this.getCategoryById.invoke(id)))

            const missingCategories = allCategories?.filter(category => !category)

            if(missingCategories?.length > 0) {
                res.status(httpStatus.BAD_REQUEST).send("Some categories do not exist")
                return;
            }

            const product = await this.adminCreateProductServices.invoke(
                    name,
                    description,
                    price,
                    image,
                    userId,
                    categoryIds
            )
            res.status(httpStatus.CREATED).send()

        } catch (error) {
            next(error)
        }
    }
}