import { NextFunction, Response } from "express";
import { AdminGetSalesAnalysisService } from "../../../../../contexts/ecom/products/application/admin-get-sales-analysis.services";
import { Controller } from "../controller";
import { GetUserByIdService } from "../../../../../contexts/ecom/users/application/get-user-by-id.services";
import { UserRole } from "@prisma/client";
import httpStatus from "http-status";
import { MESSAGE_CODES } from "../../../../../contexts/shared/infrastructure/utils/message-code";

export class AdminGetSalesAnalyticsController implements Controller {
    constructor(private readonly adminGetSalesAnalysisService: AdminGetSalesAnalysisService,
        private readonly getUserByIdService: GetUserByIdService,
    ) { }

    public async invoke(req: any, res: Response, next: NextFunction): Promise<void> {
        try {

            const user_id = req.user.user_id as string

            const user = await this.getUserByIdService.invoke(String(user_id))

            if (!user || user.role !== UserRole.ADMIN) {
                res.status(httpStatus.UNAUTHORIZED).send(MESSAGE_CODES.NOT_AUTHORIZED);
                return;
            }

            const { time } = req.query;
            const salesAnalytics = await this.adminGetSalesAnalysisService.invoke(time as string);
            res.status(httpStatus.OK).send(salesAnalytics);
        } catch (error) {
            next(error)
        }
    }
}