import { Router } from "express";
import { HealthCheckRouter } from './health-check.routes'
import { UsersRouter } from "./users.routes";
import * as controllers from '../controllers';

export const MasterRouter = (
    // healthCheck
    healthCheckController: controllers.HealthCheckController,
    createUserController: controllers.CreateUserController,
) : Router => {
const apiRouter = Router();
HealthCheckRouter(
    healthCheckController,
    apiRouter
),
UsersRouter(
    createUserController,
    apiRouter
)
return apiRouter;
}