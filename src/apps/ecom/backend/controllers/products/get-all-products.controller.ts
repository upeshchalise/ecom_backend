import { NextFunction, Request, Response } from "express";
import { Controller } from "../controller";
import { GetAllProductsService } from "../../../../../contexts/ecom/products/application/get-all-products.services";
import httpStatus from "http-status";

export class GetAllProductsController implements Controller {
    constructor(private readonly getAllProductsService: GetAllProductsService){}

    public async invoke(req:Request, res:Response, next:NextFunction): Promise<void> {
        
      console.log("query params", req.query);
      const categoriesFilter = req.query.categories ? (req.query.categories as string).split(",") : []
        try {
          const products =  await this.getAllProductsService.invoke({
            limit: Number(req.query.pageSize),
            page: Number(req.query.page),
            search: req.query.search as string,
            categories: categoriesFilter
          });
            res.status(httpStatus.OK).send(products);
        } catch (error) {
            next(error)
        }
    }
}