import { NextFunction, Request, Response } from "express";
import { Controller } from "../controller";
import { body } from "express-validator";
import { RequestValidator } from "../../../../../contexts/shared/infrastructure/middleware/request-validator";
import { generateHmacSha256Hash, safeStringify } from "../../../../../contexts/shared/infrastructure/utils/generate-hmac";
import axios from "axios";

export class PaymentController implements Controller {

    // constructor(){}
    public validate = [
        body('amount').exists().withMessage('Amount is required and must be a number').isNumeric().withMessage('Amount is required and must be a number'),
        body('paymentMethod').exists().withMessage('Payment method is required').isIn(['esewa', 'khalti']).isString().withMessage('Payment method is required'),
        // body('status').exists().withMessage('Invalid payment status').isIn(['pending', 'completed', 'failed']).withMessage('Invalid payment status'),
        RequestValidator
    ]
    async invoke(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { amount, paymentMethod, status, transactionId } = req.body
            console.log("Payment details:", { amount, paymentMethod, status });
            switch (paymentMethod) {
                case 'esewa': {
                    const product_code = process.env.ESEWA_MERCHANT_ID!;
                    const success_url = process.env.ESEWA_SUCCESS_URL!;
                    const failure_url = process.env.ESEWA_FAILURE_URL!;
                    const paymentUrl = process.env.ESEWA_PAYMENT_URL!;
                    const secret = process.env.ESEWA_SECRET_KEY!;

                    const signed_field_names = 'total_amount,transaction_uuid,product_code';

                    const dataToSign = `total_amount=${amount},transaction_uuid=${transactionId},product_code=${product_code}`;
                    const signature = generateHmacSha256Hash(dataToSign, secret);

                    const payload = {
                        amount,
                        tax_amount: 0,
                        product_service_charge: 0,
                        product_delivery_charge: 0,
                        total_amount: amount,
                        transaction_uuid: transactionId,
                        product_code,
                        success_url,
                        failure_url,
                        signed_field_names,
                        signature,
                    };

                    res.status(200).json({
                        esewaUrl: paymentUrl,
                        payload
                    });

                    break;
                }
                case 'khalti': {
                    // Handle khalti payment logic here
                    res.status(200).json({ message: 'Khalti payment processed successfully', amount, status });
                    break;
                }
                default: {
                    res.status(400).json({ message: 'Invalid payment method' });
                    break;
                }
            }
        } catch (error) {
            next(error)
        }
    }
}