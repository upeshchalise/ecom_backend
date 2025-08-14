import { NextFunction, Request, Response } from "express";
import { Controller } from "../controller";

export class EsewaVerifyController implements Controller {
  public validate = [];

  async invoke(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, transaction_uuid } = req.query as { status?: string; transaction_uuid?: string };

      if (!status || !transaction_uuid) {
        res.status(400).json({ message: "Missing status or transaction_uuid" });
        return;
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
