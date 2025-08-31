import { NextFunction, Request, Response } from "express";
import { Controller } from "../controller";
import { OrderStatus, PaymentsStatus, PrismaClient } from "@prisma/client";
import {query } from "express-validator";
import { RequestValidator } from "../../../../../contexts/shared/infrastructure/middleware/request-validator";
// import { generateHmacSha256Hash } from "../../../../../contexts/shared/infrastructure/utils/generate-hmac";

export class EsewaVerifyController implements Controller {
  public validate = [
    query("data").exists().withMessage("Data is required").isString().withMessage("Data must be a string").bail(),
    RequestValidator
  ];

  constructor(private readonly db: PrismaClient) { }

  async invoke(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { data } = req.query as { data: string };

      const jsonString = Buffer.from(data, 'base64').toString('utf-8');
      const paymentInfo = JSON.parse(jsonString);

      // const transactionId = paymentInfo.transaction_uuid;
      // const productCode = process.env.ESEWA_MERCHANT_ID!;
      // const secret = process.env.ESEWA_SECRET_KEY!;

      const payment = await this.db.payments.findUnique({
        where: { transactionId: paymentInfo.transaction_uuid },
        select: { id: true, orderId: true, status: true },
      });

      if (!payment) {
        res.status(404).json({ message: "Payment not found" });
        return;
      }
      // const signed_field_names = 'transaction_code,status,total_amount,transaction_uuid,product_code,signed_field_names';
      // const dataToSign = `${paymentInfo.amount},${transactionId},${productCode}`;
      // const expectedSignature = generateHmacSha256Hash(dataToSign, secret);
  

      // if (paymentInfo.signature !== expectedSignature) {
      //   res.status(400).json({ message: "Invalid signature" });
      //   return;
      // }

      const newStatus: PaymentsStatus =
        paymentInfo.status === "COMPLETE" ? PaymentsStatus.COMPLETED : PaymentsStatus.FAILED;

        // TODO: use transaction
      await this.db.payments.update({
        where: { transactionId: paymentInfo.transaction_uuid },
        data: {
          status: newStatus,
          paymentDate: new Date(),
        },
      });

      if (newStatus === PaymentsStatus.COMPLETED) {
        await this.db.order.update({
          where: { id: payment.orderId },
          data: {
            status: OrderStatus.PAID,
          },
        });
      } else if (newStatus === PaymentsStatus.FAILED) {
        await this.db.order.update({
          where: { id: payment.orderId },
          data: {
            status: OrderStatus.FAILED,
          },
        });
      }


      const redirectUrl =
        paymentInfo.status === "COMPLETE"
          ? `${process.env.CLIENT_SUCCESS_URL}?tx=${paymentInfo.transaction_uuid}&status=success`
          : `${process.env.CLIENT_FAILURE_URL}?tx=${paymentInfo.transaction_uuid}&status=failure`;

      return res.redirect(302, redirectUrl);
    } catch (error) {
      next(error);
    }
  }
}
