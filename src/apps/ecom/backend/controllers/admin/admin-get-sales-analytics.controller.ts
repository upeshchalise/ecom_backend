import { NextFunction, Response } from "express";
import { AdminGetSalesAnalysisService } from "../../../../../contexts/ecom/products/application/admin-get-sales-analysis.services";
import { Controller } from "../controller";
import { GetUserByIdService } from "../../../../../contexts/ecom/users/application/get-user-by-id.services";
import { UserRole } from "@prisma/client";
import httpStatus from "http-status";
import { MESSAGE_CODES } from "../../../../../contexts/shared/infrastructure/utils/message-code";


const AnalyticsTime = {
    '7days': '7',
    '15days': '15',
    '30days': '30',
}
export class AdminGetSalesAnalyticsController implements Controller {
    constructor(private readonly adminGetSalesAnalysisService: AdminGetSalesAnalysisService,
        private readonly getUserByIdService: GetUserByIdService,
    ) { }

    public async invoke(req: any, res: Response, next: NextFunction): Promise<void> {
        try {

            const { time } = req.query;

            let timePeriod: string | undefined;

            if (typeof time === "string" && AnalyticsTime[time as keyof typeof AnalyticsTime]) {
                timePeriod = AnalyticsTime[time as keyof typeof AnalyticsTime];
            } else {
                timePeriod = '';
            }

            const user_id = req.user.user_id as string

            const user = await this.getUserByIdService.invoke(String(user_id))

            if (!user || user.role !== UserRole.ADMIN) {
                res.status(httpStatus.UNAUTHORIZED).send(MESSAGE_CODES.NOT_AUTHORIZED);
                return;
            }


            const salesAnalytics = await this.adminGetSalesAnalysisService.invoke(timePeriod);
            res.status(httpStatus.OK).send(salesAnalytics);
        } catch (error) {
            next(error)
        }
    }
}