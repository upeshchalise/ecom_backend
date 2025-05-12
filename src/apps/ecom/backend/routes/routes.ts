import { Request, Response,NextFunction, Router } from "express";
import { HealthCheckRouter } from './health-check.routes'
import { UsersRouter } from "./users.routes";
import { CommonRouter } from "./common.routes";
import { AdminRouter } from "./admin.routes";
import * as controllers from '../controllers';
import { IAuthorizer } from "../../../../contexts/shared/domain/interface/IAuthorizer";

export const MasterRouter = (
    // healthCheck
    healthCheckController: controllers.HealthCheckController,
    createUserController: controllers.CreateUserController,
    uploadImageController: controllers.UploadImageController,
    userLoginController: controllers.UserLoginController,
    getUserByIdController: controllers.GetUserByIdController,
    adminCreateCategoryController: controllers.AdminCreateCategoryController,
    adminAuthorizer: IAuthorizer<Request, Response, NextFunction>

) : Router => {
const apiRouter = Router();
HealthCheckRouter(
    healthCheckController,
    apiRouter
),
UsersRouter(
    createUserController,
    getUserByIdController,
    userLoginController,
    apiRouter
)
CommonRouter(
    uploadImageController,
    apiRouter
)
AdminRouter(
    adminCreateCategoryController,
    adminAuthorizer,
    apiRouter
)
return apiRouter;
}