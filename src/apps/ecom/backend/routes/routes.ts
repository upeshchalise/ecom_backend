import { Router } from "express";
import { HealthCheckRouter } from './health-check.routes'
import * as controllers from '../controllers';

export const MasterRouter = (
    // healthCheck
    healthCheckController: controllers.HealthCheckController
) : Router => {
const apiRouter = Router();
HealthCheckRouter(
    healthCheckController,
    apiRouter
)
return apiRouter;
}