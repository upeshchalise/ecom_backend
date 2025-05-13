import { NextFunction, Request, Response } from "express";
import { Controller } from "../controller";
import { PrismaClient } from "@prisma/client";
import  httpStatus from "http-status";
import { AdminCreateProductServices } from "../../../../../contexts/ecom/products/application/admin-create-product.services";
import { GetCategoryById } from "../../../../../contexts/ecom/products/application/get-category-by-id.services";

export class AdminCreateProductController implements Controller {
        constructor(private db: PrismaClient,
            private adminCreateProductServices: AdminCreateProductServices,
            private getCategoryById: GetCategoryById
        ){}
    
    async invoke(req:any, res:Response, next:NextFunction): Promise<void> {
        const categoryIds = req.body.category_ids;
        const {name, description, price, image} = req.body;
        const userId = req.user.user_id as string
        try {
            
            const allCategories = await Promise.all(categoryIds?.map(async (id: string) => await this.getCategoryById.invoke(id)))

            const missingCategories = allCategories?.filter(category => !category)

            if(missingCategories?.length > 0) {
                // throw new Error("Some categories do not exist")
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