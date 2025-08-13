import { Router } from "express";
import * as controller from "../controllers";

export const PaymentRouter = (paymentController: controller.PaymentController, router:Router): Router => {
    router.post("/payment", paymentController.validate, paymentController.invoke.bind(paymentController)
    /*#swagger.tags = ['Payment']
    #swagger.description = 'Payment API'
    */);

    return router;
}