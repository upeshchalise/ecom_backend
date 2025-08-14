import { NextFunction, Request, Response } from "express";

import { Controller } from "../controller";
import { body } from "express-validator";
import { RequestValidator } from "../../../../../contexts/shared/infrastructure/middleware/request-validator";
import { generateHmacSha256Hash } from "../../../../../contexts/shared/infrastructure/utils/generate-hmac";
import { PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export class PaymentController implements Controller {

    constructor(private readonly db: PrismaClient) { }
    public validate = [
        body('amount').exists().withMessage('Amount is required and must be a number').isNumeric().withMessage('Amount is required and must be a number'),
        body('paymentMethod').exists().withMessage('Payment method is required').isIn(['esewa', 'khalti']).isString().withMessage('Payment method is required'),
        // body('status').exists().withMessage('Invalid payment status').isIn(['pending', 'completed', 'failed']).withMessage('Invalid payment status'),
        RequestValidator
    ]
    async invoke(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // const {user_id} = req.user;
            const { amount, paymentMethod, status, transactionId,destination, items } = req.body
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


                    await this.db.order.create({
                        data: {
                            userId: req?.params?.userId, // Assuming user_id is passed in headers
                            totalAmount: new Decimal(amount),
                            destination: destination ?? "home",
                            orderItems: {
                                create: items.map((item: any) => ({
                                    productId: item.id,
                                    quantity: item.quantity,
                                    unitPrice: new Decimal(item.price),
                                })),
                            },
                            Payments: {
                                create: {
                                    amount: new Decimal(amount),
                                    paymentMethod: 'ESEWA',
                                    status: 'PENDING',
                                    transactionId,
                                },
                            },
                        },
                        include: {
                            orderItems: true,
                            Payments: true,
                        },
                    });


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