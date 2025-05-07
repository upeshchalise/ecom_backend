import { Router } from "express";
import { HealthCheckRouter } from './health-check.routes'
import { UsersRouter } from "./users.routes";
import { CommonRouter } from "./common.routes";
import * as controllers from '../controllers';

export const MasterRouter = (
    // healthCheck
    healthCheckController: controllers.HealthCheckController,
    createUserController: controllers.CreateUserController,
    uploadImageController: controllers.UploadImageController,
    getUserByIdController: controllers.GetUserByIdController,
) : Router => {
const apiRouter = Router();
HealthCheckRouter(
    healthCheckController,
    apiRouter
),
UsersRouter(
    createUserController,
    getUserByIdController,
    apiRouter
)
CommonRouter(
    uploadImageController,
    apiRouter
)
return apiRouter;
}