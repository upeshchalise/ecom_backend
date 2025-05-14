import { NextFunction, Request, Response } from "express";
import { Controller } from "../controller";
import { GetAllProductsService } from "../../../../../contexts/ecom/products/application/get-all-products.services";
import httpStatus from "http-status";

export class GetAllProductsController implements Controller {
    constructor(private getAllProductsService: GetAllProductsService){}

    public async invoke(req:Request, res:Response, next:NextFunction): Promise<void> {
        
        try {
          const products =  await this.getAllProductsService.invoke({
            // limit: Number(req.query.limit),
            // page: Number(req.query.page),
            limit: 10,
            page: 1,
            search: req.query.search as string
          });
            res.status(httpStatus.OK).send(products);
        } catch (error) {
            next(error)
        }
    }
}