import { Request, Response, NextFunction } from "express";
import { Controller } from "../controller";
import httpStatus from "http-status";
import { GetAllCategoriesServices } from "../../../../../contexts/ecom/products/application/get-all-categories.services";

export class GetAllCategoriesController implements Controller {
    constructor(private readonly getAllCategoriesServices: GetAllCategoriesServices) { }

    public async invoke(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const categories = await this.getAllCategoriesServices.invoke();
            res.status(httpStatus.OK).send(categories)
        } catch (error) {
            next(error)
        }
    }
}