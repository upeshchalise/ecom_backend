import { NextFunction, Request, Response } from "express";
import { Controller } from "../controller";
import { OrderStatus, PaymentsStatus, PrismaClient } from "@prisma/client";

export class EsewaVerifyController implements Controller {
  public validate = [];

      constructor(private readonly db: PrismaClient) { }
  
  async invoke(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, transaction_uuid } = req.query as { status?: string; transaction_uuid?: string };

      if (!status || !transaction_uuid) {
        res.status(400).json({ message: "Missing status or transaction_uuid" });
        return;
      }

      const payment = await this.db.payments.findUnique({
        where: { transactionId: transaction_uuid },
        select: { id: true, orderId: true, status: true },
      });

      if (!payment) {
        res.status(404).json({ message: "Payment not found" });
        return;
      }

      const newStatus: PaymentsStatus =
        status === "SUCCESS" ? PaymentsStatus.COMPLETED : PaymentsStatus.FAILED;

      await this.db.payments.update({
        where: { transactionId: transaction_uuid },
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
        status === "SUCCESS"
          ? `${process.env.CLIENT_SUCCESS_URL}?tx=${transaction_uuid}&status=success`
          : `${process.env.CLIENT_FAILURE_URL}?tx=${transaction_uuid}&status=failure`;

      return res.redirect(302, redirectUrl);
    } catch (error) {
      next(error);
    }
  }
}
