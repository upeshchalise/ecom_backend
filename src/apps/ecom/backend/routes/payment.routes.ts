import { NextFunction, Router, Request, Response } from "express";
import * as controller from "../controllers";
import { IAuthorizer } from "../../../../contexts/shared/domain/interface/IAuthorizer";


export const PaymentRouter = (paymentController: controller.PaymentController,esewaVerifyController: controller.EsewaVerifyController,userAuthorizer: IAuthorizer<Request, Response, NextFunction>, router:Router): Router => {
    router.post("/payment/:userId", paymentController.validate,paymentController.invoke.bind(paymentController)
    /*#swagger.tags = ['Payment']
    #swagger.description = 'Payment API'
    */);

    router.get("/payment/esewa/verify", esewaVerifyController.validate,esewaVerifyController.invoke.bind(esewaVerifyController)
      /*#swagger.tags = ['Payment']
    #swagger.description = 'Payment verification API'
    */
);

    return router;
}