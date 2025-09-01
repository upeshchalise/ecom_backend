import { NextFunction, Request, Response } from "express";
import { Controller } from "../controller";
import { InteractionType, OrderStatus, PaymentsStatus, PrismaClient } from "@prisma/client";
import { query } from "express-validator";
import { RequestValidator } from "../../../../../contexts/shared/infrastructure/middleware/request-validator";
import { UpdateUserInteractionService } from "../../../../../contexts/ecom/products/application/update-user-interaction.service";
// import { generateHmacSha256Hash } from "../../../../../contexts/shared/infrastructure/utils/generate-hmac";

export class EsewaVerifyController implements Controller {
  public validate = [
    query("data").exists().withMessage("Data is required").isString().withMessage("Data must be a string").bail(),
    RequestValidator
  ];

  constructor(private readonly db: PrismaClient,
    private readonly updateUserInteractionService: UpdateUserInteractionService,

  ) { }

  async invoke(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { data } = req.query as { data: string };

      const jsonString = Buffer.from(data, 'base64').toString('utf-8');
      const paymentInfo = JSON.parse(jsonString);
      console.log("payment info", paymentInfo);

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

      const orderItem = await this.db.order.findFirst({
        where: {
          Payments: {
            some: {
              transactionId: paymentInfo.transaction_uuid
            }
          }
        },
        select: {
          id: true,
          userId: true,
          orderItems: {
            select: {
              id: true,
              productId: true,
              quantity: true,
              product: {
                select: {
                  categories: {
                    select: {
                      id: true,
                    }
                  }
                }
              }
            }
          }
        }
      });

      if (!orderItem) {
        res.status(404).json({ message: "Order not found" });
        return;
      }

      const categoryIds = orderItem.orderItems.map(item => item.product.categories.map(cat => cat.id)).flat();
      console.log("category ids", categoryIds);

      const newStatus: PaymentsStatus =
        paymentInfo.status === "COMPLETE" ? PaymentsStatus.COMPLETED : PaymentsStatus.FAILED;

      if (newStatus === PaymentsStatus.COMPLETED) {
        await this.db.$transaction(async (tx) => {
          await tx.payments.update({
            where: { transactionId: paymentInfo.transaction_uuid },
            data: {
              status: newStatus,
              paymentDate: new Date(),
            },
          });
          await tx.order.update({
            where: { id: payment.orderId },
            data: {
              status: OrderStatus.PAID,
            },
          });

          for (const order of orderItem.orderItems) {
            await tx.product.update({
              where: {
                id: order.productId
              },
              data: {
                quantity: {
                  decrement: order.quantity
                }
              }
            });
          }
          await this.updateUserInteractionService.invoke(
            orderItem.userId,
            categoryIds,
            InteractionType.PURCHASE
          )
        });

      } else if (newStatus === PaymentsStatus.FAILED) {
        await this.db.$transaction(async (tx) => {
          await tx.payments.update({
            where: { transactionId: paymentInfo.transaction_uuid },
            data: {
              status: newStatus,
              paymentDate: new Date(),
            },
          });
          await tx.order.update({
            where: { id: payment.orderId },
            data: {
              status: OrderStatus.FAILED,
            },
          });
        })

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
