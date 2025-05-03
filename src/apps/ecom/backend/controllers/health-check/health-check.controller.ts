import { Request, Response } from "express";
import { Controller } from "../controller";
import httpStatus  from "http-status";

export class HealthCheckController implements Controller {
   async invoke(req:Request, res:Response):Promise<void> {
    try {
        res.status(httpStatus.OK).send({
            status: "UP",
            message: "Server is running",
          });
    } catch (error) {
        console.error("Error in health check controller", error);
    }
   
   }
}