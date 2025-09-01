import { NextFunction, Request, Response } from "express";

import { Controller } from "../controller";
import { body } from "express-validator";
import { RequestValidator } from "../../../../../contexts/shared/infrastructure/middleware/request-validator";
import { generateHmacSha256Hash } from "../../../../../contexts/shared/infrastructure/utils/generate-hmac";
import { PaymentMethod, PaymentsStatus, PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";


export class PaymentController implements Controller {

    constructor(private readonly db: PrismaClient) { }
    public validate = [
        body('amount').exists().withMessage('Amount is required and must be a number').isNumeric().withMessage('Amount is required and must be a number'),
        body('paymentMethod').exists().withMessage('Payment method is required').isIn(['esewa', 'khalti']).isString().withMessage('Payment method is required'),
        body('transactionId').exists().withMessage('Transaction ID is required').isString().withMessage('Transaction ID is required'),
        body('destination').optional().isString().withMessage('Destination must be a string'),
        body('items').exists().withMessage('Items are required').isArray().withMessage('Items must be an array'),
        body('items.*.id').exists().withMessage('Item ID is required').isUUID().withMessage('Item ID must be a valid UUID'),
        body('items.*.quantity').exists().withMessage('Item quantity is required').isInt().withMessage('Item quantity must be an integer'),
        body('items.*.price').exists().withMessage('Item price is required').isNumeric().withMessage('Item price must be a number'),
        RequestValidator
    ]
    async invoke(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // const userId = req.params.userId;
            const { amount, paymentMethod, status, transactionId, destination, items } = req.body

            for (let item of items) {
                const itemId = item.id;
                const quantity = item.quantity;
                console.log(itemId, quantity)
                const enoughItems = await this.db.product.findFirst({
                    where: {
                        id: itemId,
                    }
                })
                if (!enoughItems || enoughItems?.quantity! < quantity) {
                    res.status(400).json({ message: `Not enough stock for item "${enoughItems?.name}"` });
                    return
                }
            }
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
                                    paymentMethod: PaymentMethod.ESEWA,
                                    status: PaymentsStatus.PENDING,
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