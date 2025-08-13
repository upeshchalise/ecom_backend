import { NextFunction, Request, Response } from "express";
import { Controller } from "../controller";
import { body } from "express-validator";
import { RequestValidator } from "../../../../../contexts/shared/infrastructure/middleware/request-validator";

export class PaymentController implements Controller {

    // constructor(){}
    public validate = [
        body('amount').exists().withMessage('Amount is required and must be a number').isNumeric().withMessage('Amount is required and must be a number'),
        body('paymentMethod').exists().withMessage('Payment method is required').isIn(['esewa', 'khalti']).isString().withMessage('Payment method is required'),
        // body('status').exists().withMessage('Invalid payment status').isIn(['pending', 'completed', 'failed']).withMessage('Invalid payment status'),
        RequestValidator
    ]
    async invoke(req:Request, res:Response, next: NextFunction): Promise<void> {
        try {
            const {amount, paymentMethod, status} = req.body
            console.log("Payment details:", {amount, paymentMethod, status});
        } catch (error) {
            next(error)
        }
    }
}