import { Router } from "express";
import * as controller from "../controllers";

export const HealthCheckRouter = (healthCheckController: controller.HealthCheckController, router: Router): Router => {
    router.get("/health_check", healthCheckController.invoke.bind(healthCheckController)
    /*#swagger.tags = ['Health Check']
    #swagger.description = 'Health Check API'
    */);

    return router
}